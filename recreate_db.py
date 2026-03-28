import asyncio
from backend.models import Base
from backend.database import engine

async def recreate():
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
            await conn.run_sync(Base.metadata.create_all)
        print("Database recreated successfully via SQLAlchemy!")
    except Exception as e:
        import traceback
        traceback.print_exc()

asyncio.run(recreate())
