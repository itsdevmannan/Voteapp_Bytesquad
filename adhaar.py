import aiosqlite
import asyncio

async def create_database():
    db_path = "voter.sqlite"  # Changed database name
    async with aiosqlite.connect(db_path) as db:
        await db.execute("""
        CREATE TABLE IF NOT EXISTS adhaar_data (
            adhaar_id TEXT PRIMARY KEY,
            name TEXT NOT NULL
        )
        """)

        dummy_data = [
            ("345678923456", "Ahmad"),
            ("987537591264", "Zainab"),
            ("495624102934", "Mannan"),
            ("041838612038", "Anya"),
            ("172647593826", "Subhash")
        ]
        
        await db.executemany("INSERT OR IGNORE INTO adhaar_data (adhaar_id, name) VALUES (?, ?)", dummy_data)
        await db.commit()

    print("Database `voter.sqlite` created successfully.")

asyncio.run(create_database())
