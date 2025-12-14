import os
import uuid
import math
import asyncio
from datetime import datetime
from typing import Optional, List
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import httpx

load_dotenv()

# ===================== CONFIG =====================
MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017/mapchap")
TELEGRAM_BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "")
DADATA_API_KEY = os.environ.get("DADATA_API_KEY", "")
YANDEX_MAPS_API_KEY = os.environ.get("YANDEX_MAPS_API_KEY", "")
SUPPORT_EMAIL = os.environ.get("SUPPORT_EMAIL", "khabibullaevakhrorjon@gmail.com")
SUPPORT_PHONE = os.environ.get("SUPPORT_PHONE", "+79998214758")

# ===================== DATABASE =====================
client: AsyncIOMotorClient = None
db = None

async def init_db():
    global client, db
    client = AsyncIOMotorClient(MONGO_URL)
    db = client.mapchap
    # Create indexes
    await db.users.create_index("telegram_id", unique=True)
    await db.offers.create_index("user_id")
    await db.offers.create_index("category")
    await db.offers.create_index([("coordinates", "2dsphere")])
    await db.articles.create_index("author_id")
    await db.view_history.create_index("user_id")
    await db.boosts.create_index("user_id")
    await db.boosts.create_index("offer_id")
    await db.boosts.create_index("expires_at")
    print("✅ MongoDB connected")

async def close_db():
    global client
    if client:
        client.close()
        print("❌ MongoDB disconnected")

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield
    await close_db()

# ===================== APP =====================
app = FastAPI(
    title="MapChap API",
    description="API для Telegram Mini App - платформа бизнес-объявлений на карте",
    version="3.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===================== MODELS =====================
class TelegramUser(BaseModel):
    id: int
    first_name: str
    last_name: Optional[str] = ""
    username: Optional[str] = ""
    photo_url: Optional[str] = ""
    language_code: Optional[str] = "ru"

class UserProfile(BaseModel):
    telegram_id: int
    first_name: str
    last_name: Optional[str] = ""
    username: Optional[str] = ""
    photo_url: Optional[str] = ""
    email: Optional[str] = ""
    phone: Optional[str] = ""
    instagram: Optional[str] = ""
    telegram_username: Optional[str] = ""
    role: str = "user"
    is_verified: bool = False
    verification_type: Optional[str] = None  # "inn" or "manual"
    inn: Optional[str] = None
    company_name: Optional[str] = None
    favorite_categories: List[str] = []
    favorites: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_location: Optional[dict] = None
    notifications_enabled: bool = True

class BusinessVerificationINN(BaseModel):
    inn: str

class BusinessVerificationManual(BaseModel):
    phone: str
    email: str
    social_username: str  # Instagram or Telegram
    social_type: str  # "instagram" or "telegram"
    company_name: str

class OfferCreate(BaseModel):
    title: str
    description: str
    full_description: Optional[str] = ""  # Полное описание
    category: str
    address: str
    phone: str
    email: Optional[str] = ""
    website: Optional[str] = ""
    working_hours: Optional[str] = ""
    price_level: Optional[str] = "medium"
    coordinates: List[float]  # [lat, lng]
    images: List[str] = []
    tags: List[str] = []
    amenities: List[str] = []  # Удобства: wifi, parking, card_payment, delivery, etc.
    inn: Optional[str] = None  # ИНН компании если верифицирован

class OfferUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    full_description: Optional[str] = None
    category: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    working_hours: Optional[str] = None
    price_level: Optional[str] = None
    coordinates: Optional[List[float]] = None
    images: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    amenities: Optional[List[str]] = None
    status: Optional[str] = None

class ArticleCreate(BaseModel):
    title: str
    content: str
    excerpt: str
    category: str
    image: Optional[str] = ""
    tags: List[str] = []
    author_type: str = "user"  # "developer", "business", "user"

class LocationUpdate(BaseModel):
    latitude: float
    longitude: float

# ===================== UTILITIES =====================
def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance between two points in km using Haversine formula"""
    R = 6371
    dLat = math.radians(lat2 - lat1)
    dLon = math.radians(lon2 - lon1)
    a = math.sin(dLat/2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dLon/2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c

async def send_telegram_notification(chat_id: int, message: str):
    """Send notification to user via Telegram Bot"""
    if not TELEGRAM_BOT_TOKEN:
        print("⚠️ Telegram bot token not configured")
        return False
    
    try:
        async with httpx.AsyncClient() as client:
            url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
            response = await client.post(url, json={
                "chat_id": chat_id,
                "text": message,
                "parse_mode": "HTML"
            })
            return response.status_code == 200
    except Exception as e:
        print(f"❌ Telegram notification error: {e}")
        return False

async def verify_inn_dadata(inn: str) -> dict:
    """Verify INN using DaData API"""
    if not DADATA_API_KEY:
        raise HTTPException(status_code=500, detail="DaData API key not configured")
    
    try:
        async with httpx.AsyncClient() as client:
            url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party"
            headers = {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": f"Token {DADATA_API_KEY}"
            }
            response = await client.post(url, json={"query": inn}, headers=headers)
            data = response.json()
            
            if data.get("suggestions") and len(data["suggestions"]) > 0:
                company = data["suggestions"][0]
                return {
                    "success": True,
                    "inn": company["data"].get("inn"),
                    "name": company["value"],
                    "ogrn": company["data"].get("ogrn"),
                    "address": company["data"].get("address", {}).get("value"),
                    "status": company["data"].get("state", {}).get("status")
                }
            return {"success": False, "error": "ИНН не найден"}
    except Exception as e:
        print(f"❌ DaData error: {e}")
        return {"success": False, "error": str(e)}

# ===================== ROUTES =====================

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "version": "3.0.0", "service": "MapChap API"}

# ---------- AUTH & USERS ----------
@app.post("/api/auth/telegram")
async def telegram_auth(user_data: TelegramUser):
    """Authenticate user via Telegram WebApp data"""
    existing = await db.users.find_one({"telegram_id": user_data.id})
    
    if existing:
        # Update user data from Telegram
        await db.users.update_one(
            {"telegram_id": user_data.id},
            {"$set": {
                "first_name": user_data.first_name,
                "last_name": user_data.last_name or "",
                "username": user_data.username or "",
                "photo_url": user_data.photo_url or "",
                "last_login": datetime.utcnow()
            }}
        )
        user = await db.users.find_one({"telegram_id": user_data.id})
    else:
        # Create new user
        user_doc = {
            "id": str(uuid.uuid4()),
            "telegram_id": user_data.id,
            "first_name": user_data.first_name,
            "last_name": user_data.last_name or "",
            "username": user_data.username or "",
            "photo_url": user_data.photo_url or "",
            "email": "",
            "phone": "",
            "instagram": "",
            "telegram_username": user_data.username or "",
            "role": "user",
            "is_verified": False,
            "verification_type": None,
            "inn": None,
            "company_name": None,
            "favorite_categories": [],
            "favorites": [],
            "created_at": datetime.utcnow(),
            "last_login": datetime.utcnow(),
            "last_location": None,
            "notifications_enabled": True
        }
        await db.users.insert_one(user_doc)
        user = user_doc
    
    user["_id"] = str(user.get("_id", ""))
    return {"success": True, "user": user}

@app.get("/api/users/{telegram_id}")
async def get_user(telegram_id: int):
    user = await db.users.find_one({"telegram_id": telegram_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user["_id"] = str(user["_id"])
    return user

@app.put("/api/users/{telegram_id}")
async def update_user(telegram_id: int, updates: dict = Body(...)):
    result = await db.users.update_one(
        {"telegram_id": telegram_id},
        {"$set": updates}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    user = await db.users.find_one({"telegram_id": telegram_id})
    user["_id"] = str(user["_id"])
    return user

@app.put("/api/users/{telegram_id}/favorites")
async def update_favorites(telegram_id: int, offer_id: str = Body(..., embed=True)):
    user = await db.users.find_one({"telegram_id": telegram_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    favorites = user.get("favorites", [])
    if offer_id in favorites:
        favorites.remove(offer_id)
        action = "removed"
    else:
        favorites.append(offer_id)
        action = "added"
    
    await db.users.update_one(
        {"telegram_id": telegram_id},
        {"$set": {"favorites": favorites}}
    )
    return {"success": True, "action": action, "favorites": favorites}

@app.put("/api/users/{telegram_id}/favorite-categories")
async def update_favorite_categories(telegram_id: int, categories: List[str] = Body(...)):
    await db.users.update_one(
        {"telegram_id": telegram_id},
        {"$set": {"favorite_categories": categories}}
    )
    return {"success": True, "favorite_categories": categories}

# ---------- BUSINESS VERIFICATION ----------
@app.post("/api/verification/inn")
async def verify_by_inn(telegram_id: int = Query(...), data: BusinessVerificationINN = Body(...)):
    """Verify business by INN using DaData"""
    result = await verify_inn_dadata(data.inn)
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result.get("error", "Ошибка проверки ИНН"))
    
    # Update user as verified business
    await db.users.update_one(
        {"telegram_id": telegram_id},
        {"$set": {
            "role": "business_owner",
            "is_verified": True,
            "verification_type": "inn",
            "inn": data.inn,
            "company_name": result["name"]
        }}
    )
    
    return {
        "success": True,
        "verification": result,
        "message": "Бизнес успешно верифицирован через ИНН"
    }

@app.post("/api/verification/manual")
async def verify_manually(telegram_id: int = Query(...), data: BusinessVerificationManual = Body(...)):
    """Manual verification with phone, email, and social media"""
    # Update user as pending verification
    await db.users.update_one(
        {"telegram_id": telegram_id},
        {"$set": {
            "role": "business_owner",
            "is_verified": True,  # For MVP, auto-verify
            "verification_type": "manual",
            "phone": data.phone,
            "email": data.email,
            "company_name": data.company_name,
            f"{data.social_type}_username": data.social_username
        }}
    )
    
    return {
        "success": True,
        "message": "Заявка на верификацию принята. Ваш бизнес-аккаунт активирован."
    }

# ---------- OFFERS ----------
@app.get("/api/offers")
async def get_offers(
    category: Optional[str] = None,
    lat: Optional[float] = None,
    lng: Optional[float] = None,
    radius: Optional[float] = 10,  # km
    search: Optional[str] = None,
    limit: int = 50,
    skip: int = 0
):
    query = {"status": "active"}
    
    if category and category != "all":
        query["category"] = category
    
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"tags": {"$regex": search, "$options": "i"}}
        ]
    
    if lat and lng:
        query["coordinates"] = {
            "$nearSphere": {
                "$geometry": {
                    "type": "Point",
                    "coordinates": [lng, lat]
                },
                "$maxDistance": radius * 1000
            }
        }
    
    cursor = db.offers.find(query).skip(skip).limit(limit)
    offers = []
    async for offer in cursor:
        offer["_id"] = str(offer["_id"])
        offers.append(offer)
    
    total = await db.offers.count_documents(query)
    return {"offers": offers, "total": total}

@app.get("/api/offers/{offer_id}")
async def get_offer(offer_id: str):
    offer = await db.offers.find_one({"id": offer_id})
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    offer["_id"] = str(offer["_id"])
    return offer

@app.post("/api/offers")
async def create_offer(telegram_id: int = Query(...), offer: OfferCreate = Body(...)):
    user = await db.users.find_one({"telegram_id": telegram_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.get("role") != "business_owner":
        raise HTTPException(status_code=403, detail="Only business owners can create offers")
    
    offer_doc = {
        "id": str(uuid.uuid4()),
        "user_id": telegram_id,
        **offer.dict(),
        "coordinates": {
            "type": "Point",
            "coordinates": [offer.coordinates[1], offer.coordinates[0]]  # MongoDB expects [lng, lat]
        },
        "status": "active",
        "views": 0,
        "likes": 0,
        "rating": 0,
        "reviews_count": 0,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    await db.offers.insert_one(offer_doc)
    offer_doc["_id"] = str(offer_doc["_id"])
    return offer_doc

@app.put("/api/offers/{offer_id}")
async def update_offer(offer_id: str, telegram_id: int = Query(...), updates: OfferUpdate = Body(...)):
    offer = await db.offers.find_one({"id": offer_id})
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    
    if offer["user_id"] != telegram_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this offer")
    
    update_data = {k: v for k, v in updates.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    if "coordinates" in update_data:
        coords = update_data["coordinates"]
        update_data["coordinates"] = {
            "type": "Point",
            "coordinates": [coords[1], coords[0]]
        }
    
    await db.offers.update_one({"id": offer_id}, {"$set": update_data})
    updated = await db.offers.find_one({"id": offer_id})
    updated["_id"] = str(updated["_id"])
    return updated

@app.delete("/api/offers/{offer_id}")
async def delete_offer(offer_id: str, telegram_id: int = Query(...)):
    offer = await db.offers.find_one({"id": offer_id})
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    
    if offer["user_id"] != telegram_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this offer")
    
    await db.offers.delete_one({"id": offer_id})
    return {"success": True, "message": "Offer deleted"}

@app.get("/api/offers/user/{telegram_id}")
async def get_user_offers(telegram_id: int):
    cursor = db.offers.find({"user_id": telegram_id})
    offers = []
    async for offer in cursor:
        offer["_id"] = str(offer["_id"])
        offers.append(offer)
    return {"offers": offers}

@app.post("/api/offers/{offer_id}/view")
async def track_offer_view(offer_id: str, telegram_id: int = Query(...)):
    # Increment view count
    await db.offers.update_one({"id": offer_id}, {"$inc": {"views": 1}})
    
    # Add to view history
    await db.view_history.insert_one({
        "id": str(uuid.uuid4()),
        "user_id": telegram_id,
        "offer_id": offer_id,
        "viewed_at": datetime.utcnow()
    })
    
    return {"success": True}

# ---------- VIEW HISTORY ----------
@app.get("/api/users/{telegram_id}/history")
async def get_view_history(telegram_id: int, limit: int = 50):
    cursor = db.view_history.find({"user_id": telegram_id}).sort("viewed_at", -1).limit(limit)
    history = []
    async for item in cursor:
        offer = await db.offers.find_one({"id": item["offer_id"]})
        if offer:
            offer["_id"] = str(offer["_id"])
            offer["viewed_at"] = item["viewed_at"]
            history.append(offer)
    return {"history": history}

# ---------- FAVORITES ----------
@app.get("/api/users/{telegram_id}/favorites")
async def get_user_favorites(telegram_id: int):
    user = await db.users.find_one({"telegram_id": telegram_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    favorites = []
    for offer_id in user.get("favorites", []):
        offer = await db.offers.find_one({"id": offer_id})
        if offer:
            offer["_id"] = str(offer["_id"])
            favorites.append(offer)
    
    return {"favorites": favorites}

# ---------- BLOG/ARTICLES ----------
@app.get("/api/articles")
async def get_articles(
    author_type: Optional[str] = None,
    category: Optional[str] = None,
    limit: int = 20,
    skip: int = 0
):
    query = {"status": "published"}
    
    if author_type:
        query["author_type"] = author_type
    if category:
        query["category"] = category
    
    cursor = db.articles.find(query).sort("created_at", -1).skip(skip).limit(limit)
    articles = []
    async for article in cursor:
        article["_id"] = str(article["_id"])
        # Get author info
        author = await db.users.find_one({"telegram_id": article["author_id"]})
        if author:
            article["author"] = {
                "id": author["telegram_id"],
                "name": f"{author['first_name']} {author.get('last_name', '')}".strip(),
                "avatar": author.get("photo_url", ""),
                "role": author.get("role", "user")
            }
        articles.append(article)
    
    total = await db.articles.count_documents(query)
    return {"articles": articles, "total": total}

@app.post("/api/articles")
async def create_article(telegram_id: int = Query(...), article: ArticleCreate = Body(...)):
    user = await db.users.find_one({"telegram_id": telegram_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    article_doc = {
        "id": str(uuid.uuid4()),
        "author_id": telegram_id,
        **article.dict(),
        "status": "published",
        "views": 0,
        "likes": 0,
        "comments_count": 0,
        "read_time": max(1, len(article.content.split()) // 200),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    await db.articles.insert_one(article_doc)
    article_doc["_id"] = str(article_doc["_id"])
    return article_doc

# ---------- LOCATION & NOTIFICATIONS ----------
@app.post("/api/users/{telegram_id}/location")
async def update_location(telegram_id: int, location: LocationUpdate):
    """Update user location and send notifications about nearby places"""
    user = await db.users.find_one({"telegram_id": telegram_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update location
    await db.users.update_one(
        {"telegram_id": telegram_id},
        {"$set": {"last_location": {"lat": location.latitude, "lng": location.longitude, "updated_at": datetime.utcnow()}}}
    )
    
    # Check for nearby places in favorite categories
    if user.get("notifications_enabled", True) and user.get("favorite_categories"):
        nearby_offers = []
        
        # Find nearby offers in favorite categories
        for category in user.get("favorite_categories", []):
            cursor = db.offers.find({
                "status": "active",
                "category": category,
                "coordinates": {
                    "$nearSphere": {
                        "$geometry": {
                            "type": "Point",
                            "coordinates": [location.longitude, location.latitude]
                        },
                        "$maxDistance": 1000  # 1km radius
                    }
                }
            }).limit(3)
            
            async for offer in cursor:
                nearby_offers.append(offer)
        
        # Send notification if there are nearby places
        if nearby_offers and len(nearby_offers) > 0:
            category_icons = {
                "food": "🍕", "shopping": "🛍️", "beauty": "💄", "services": "🔧",
                "medical": "⚕️", "furniture": "🛋️", "pharmacy": "💊", "entertainment": "🎭"
            }
            
            message = f"📍 <b>Рядом с вами найдены места из ваших любимых категорий!</b>\n\n"
            for offer in nearby_offers[:3]:
                icon = category_icons.get(offer.get("category"), "📍")
                message += f"{icon} <b>{offer['title']}</b>\n{offer['address']}\n\n"
            
            message += "Откройте MapChap, чтобы узнать больше! 🗺️"
            
            # Send async notification
            asyncio.create_task(send_telegram_notification(telegram_id, message))
    
    return {"success": True, "message": "Location updated"}

# ---------- CATEGORIES ----------
@app.get("/api/categories")
async def get_categories():
    return {
        "categories": [
            {"id": "food", "name": "Еда и рестораны", "icon": "🍕", "color": "#FF6B6B", "mapIcon": "restaurant"},
            {"id": "shopping", "name": "Магазины", "icon": "🛍️", "color": "#4ECDC4", "mapIcon": "shopping"},
            {"id": "grocery", "name": "Продукты", "icon": "🛒", "color": "#22C55E", "mapIcon": "grocery"},
            {"id": "beauty", "name": "Салоны красоты", "icon": "💄", "color": "#FFD166", "mapIcon": "beauty"},
            {"id": "services", "name": "Услуги", "icon": "🔧", "color": "#06D6A0", "mapIcon": "service"},
            {"id": "medical", "name": "Медицина", "icon": "⚕️", "color": "#118AB2", "mapIcon": "medical"},
            {"id": "furniture", "name": "Мебель и декор", "icon": "🛋️", "color": "#073B4C", "mapIcon": "furniture"},
            {"id": "pharmacy", "name": "Аптеки", "icon": "💊", "color": "#EF476F", "mapIcon": "pharmacy"},
            {"id": "fitness", "name": "Фитнес клубы", "icon": "💪", "color": "#F97316", "mapIcon": "fitness"},
            {"id": "entertainment", "name": "Развлечения", "icon": "🎭", "color": "#7209B7", "mapIcon": "entertainment"},
            {"id": "education", "name": "Образование", "icon": "📚", "color": "#F72585", "mapIcon": "education"},
            {"id": "auto", "name": "Автосервисы", "icon": "🚗", "color": "#4361EE", "mapIcon": "auto"},
            {"id": "hotel", "name": "Отели", "icon": "🏨", "color": "#4CC9F0", "mapIcon": "hotel"}
        ]
    }

# ---------- APP INFO ----------
@app.get("/api/app-info")
async def get_app_info():
    return {
        "name": "MapChap",
        "version": "3.0.0",
        "description": "Платформа для размещения бизнес-объявлений на карте",
        "support": {
            "email": SUPPORT_EMAIL,
            "phone": SUPPORT_PHONE,
            "telegram": "@mapchap_support"
        },
        "team": [
            {"name": "Хабибуллаев Ахрор", "role": "Основатель и CEO"}
        ],
        "year": 2024
    }

# ===================== BOOSTS (MONETIZATION) =====================

class BoostPurchase(BaseModel):
    boost_type: str  # "1day", "5days", "7days"
    offer_id: str

class PaymentDetails(BaseModel):
    bank_account: str
    bank_name: str
    holder_name: str
    business_id: Optional[str] = None  # ИНН/СТИР

# Boost plans configuration
BOOST_PLANS = {
    "1day": {"days": 1, "name": "1 День", "price": None, "currency": "UZS"},
    "5days": {"days": 5, "name": "5 Дней", "price": None, "currency": "UZS"},
    "7days": {"days": 7, "name": "7 Дней", "price": None, "currency": "UZS"}
}

@app.get("/api/boosts/plans")
async def get_boost_plans():
    """Get available boost plans"""
    return {
        "plans": [
            {
                "id": key,
                "days": plan["days"],
                "name": plan["name"],
                "price": plan["price"],
                "currency": plan["currency"],
                "popular": key == "5days",
                "best": key == "7days"
            }
            for key, plan in BOOST_PLANS.items()
        ]
    }

@app.get("/api/boosts/user/{telegram_id}")
async def get_user_boosts(telegram_id: int):
    """Get user's active boosts"""
    cursor = db.boosts.find({
        "user_id": telegram_id,
        "status": "active",
        "expires_at": {"$gt": datetime.utcnow()}
    })
    
    boosts = []
    async for boost in cursor:
        boost["_id"] = str(boost["_id"])
        boosts.append(boost)
    
    return {"boosts": boosts}

@app.post("/api/boosts/purchase")
async def purchase_boost(telegram_id: int = Query(...), data: BoostPurchase = Body(...)):
    """Purchase a boost for an offer"""
    # Verify user
    user = await db.users.find_one({"telegram_id": telegram_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.get("role") != "business_owner":
        raise HTTPException(status_code=403, detail="Only business owners can purchase boosts")
    
    # Verify offer ownership
    offer = await db.offers.find_one({"id": data.offer_id})
    if not offer or offer.get("user_id") != telegram_id:
        raise HTTPException(status_code=403, detail="Offer not found or not owned by user")
    
    # Get boost plan
    plan = BOOST_PLANS.get(data.boost_type)
    if not plan:
        raise HTTPException(status_code=400, detail="Invalid boost type")
    
    # Note: Prices are not set yet
    if plan["price"] is None:
        raise HTTPException(status_code=400, detail="Цены ещё не установлены. Скоро!")
    
    # Create boost record
    from datetime import timedelta
    boost_doc = {
        "id": str(uuid.uuid4()),
        "user_id": telegram_id,
        "offer_id": data.offer_id,
        "boost_type": data.boost_type,
        "days": plan["days"],
        "price": plan["price"],
        "currency": plan["currency"],
        "status": "active",
        "notifications_sent": 0,
        "created_at": datetime.utcnow(),
        "expires_at": datetime.utcnow() + timedelta(days=plan["days"])
    }
    
    await db.boosts.insert_one(boost_doc)
    boost_doc["_id"] = str(boost_doc.get("_id", ""))
    
    return {"success": True, "boost": boost_doc}

@app.post("/api/boosts/{boost_id}/send-notification")
async def send_boost_notification(boost_id: str, telegram_id: int = Query(...)):
    """Send notification to nearby users for a boosted offer"""
    # Get boost
    boost = await db.boosts.find_one({
        "id": boost_id,
        "user_id": telegram_id,
        "status": "active",
        "expires_at": {"$gt": datetime.utcnow()}
    })
    
    if not boost:
        raise HTTPException(status_code=404, detail="Active boost not found")
    
    # Get offer
    offer = await db.offers.find_one({"id": boost["offer_id"]})
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    
    # Get offer coordinates
    offer_coords = offer.get("coordinates", {}).get("coordinates", [])
    if len(offer_coords) < 2:
        raise HTTPException(status_code=400, detail="Offer coordinates not set")
    
    lng, lat = offer_coords[0], offer_coords[1]
    
    # Find nearby users with notifications enabled
    cursor = db.users.find({
        "notifications_enabled": True,
        "last_location": {"$exists": True},
        "telegram_id": {"$ne": telegram_id}  # Don't notify the owner
    })
    
    notifications_sent = 0
    async for user in cursor:
        user_loc = user.get("last_location", {})
        user_lat = user_loc.get("lat")
        user_lng = user_loc.get("lng")
        
        if user_lat and user_lng:
            distance = calculate_distance(lat, lng, user_lat, user_lng)
            
            # Within 2km radius
            if distance <= 2.0:
                # Check if user has this category in favorites
                user_categories = user.get("favorite_categories", [])
                offer_category = offer.get("category", "")
                
                # Send to all nearby users or those interested in category
                if not user_categories or offer_category in user_categories:
                    category_icons = {
                        "food": "🍕", "shopping": "🛍️", "beauty": "💄", "services": "🔧",
                        "medical": "⚕️", "fitness": "💪", "pharmacy": "💊", "entertainment": "🎭"
                    }
                    icon = category_icons.get(offer_category, "📍")
                    
                    message = (
                        f"🔥 <b>Специальное предложение рядом!</b>\n\n"
                        f"{icon} <b>{offer['title']}</b>\n"
                        f"📍 {offer['address']}\n"
                        f"📞 {offer.get('phone', '')}\n\n"
                        f"Откройте MapChap, чтобы узнать больше! 🗺️"
                    )
                    
                    success = await send_telegram_notification(user["telegram_id"], message)
                    if success:
                        notifications_sent += 1
    
    # Update boost with notification count
    await db.boosts.update_one(
        {"id": boost_id},
        {"$inc": {"notifications_sent": notifications_sent}}
    )
    
    return {
        "success": True,
        "notifications_sent": notifications_sent,
        "message": f"Отправлено {notifications_sent} уведомлений"
    }

# ---------- PAYMENT DETAILS FOR IP/BUSINESS ----------

@app.get("/api/users/{telegram_id}/payment-details")
async def get_payment_details(telegram_id: int):
    """Get user's payment details for receiving payments"""
    user = await db.users.find_one({"telegram_id": telegram_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    payment = user.get("payment_details", {})
    return {"payment_details": payment}

@app.put("/api/users/{telegram_id}/payment-details")
async def update_payment_details(telegram_id: int, data: PaymentDetails = Body(...)):
    """Update user's payment details (for IP/Business in Uzbekistan and CIS)"""
    user = await db.users.find_one({"telegram_id": telegram_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.get("role") != "business_owner":
        raise HTTPException(status_code=403, detail="Only business owners can set payment details")
    
    payment_doc = {
        "bank_account": data.bank_account,
        "bank_name": data.bank_name,
        "holder_name": data.holder_name,
        "business_id": data.business_id,
        "updated_at": datetime.utcnow()
    }
    
    await db.users.update_one(
        {"telegram_id": telegram_id},
        {"$set": {"payment_details": payment_doc}}
    )
    
    return {"success": True, "payment_details": payment_doc}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
