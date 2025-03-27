from aiohttp import web
from aiosqlite import connect
from aiohttp_cors import setup, ResourceOptions


app = web.Application(client_max_size=100 * 1024**2)
routes = web.RouteTableDef()

PARTIES = ["BJP", "AAP", "CONGRESS", "NOTA"]


@routes.get("/")
async def index(request):
    return web.json_response({"message": "Hello, World!"})


@routes.post("/vote")
async def vote(request: web.Request) -> web.Response:
    data = await request.json()
    party = data.get("party")
    if party not in PARTIES:
        return web.json_response({"error": "Invalid party"}, status=400)
    voter_id = request.headers.get("voter_id")
    if not voter_id or not voter_id.isdigit():
        return web.json_response({"error": "Voter ID not provided"}, status=400)

    async with request.app.db.execute(
        "SELECT remaining_votes FROM users WHERE voter_id = ?", (voter_id,)
    ) as cursor:
        remaining_votes = await cursor.fetchone()
 
    if not remaining_votes:
        await request.app.db.execute(
            "INSERT INTO users (voter_id, remaining_votes) VALUES (?, 1)",
            (int(voter_id),),
        )
        await request.app.db.commit()
        remaining_votes = (1,)

    if remaining_votes[0] <= 0:
        return web.json_response({"error": "No votes remaining"}, status=400)

    async with request.app.db.execute(
        "SELECT votes FROM votes WHERE party_id = ?", (party,)
    ) as cursor:
        votes = await cursor.fetchone()

    if not votes:
        return web.json_response({"error": "Party not found"}, status=404)

    await request.app.db.execute(
        "UPDATE users SET remaining_votes = ? WHERE voter_id = ?",
        (remaining_votes[0] - 1, voter_id),
    )
    await request.app.db.execute(
        "UPDATE votes SET votes = ? WHERE party_id = ?",
        (votes[0] + 1, party),
    )
    await request.app.db.commit()
    return web.json_response({"message": "Vote casted successfully"})


@routes.get("/votes")
async def votes(request: web.Request) -> web.Response:
    async with request.app.db.execute("SELECT * FROM votes") as cursor:
        vote_data = await cursor.fetchall()

    total_votes = sum(vote[1] for vote in vote_data)
    if total_votes == 0:
        return web.json_response({"error": "No votes yet!"}, status=200)

    response = {
        "total_votes": total_votes,
        "percentages": {vote[0]: round((vote[1] / total_votes) * 100, 2) for vote in vote_data}
    }
    return web.json_response(response)


cors = setup(
    app,
    defaults={
        "*": ResourceOptions(
            allow_credentials=True,
            expose_headers="*",
            allow_headers="*",
        )
    },
)
app.add_routes(routes)

for route in list(app.router.routes()):
    cors.add(route)


async def app_startup():
    app.db = await connect("db.sqlite")
    await app.db.execute(
        "CREATE TABLE IF NOT EXISTS users (voter_id INTEGER PRIMARY KEY, remaining_votes INTEGER)"
    )
    await app.db.execute(
        "CREATE TABLE IF NOT EXISTS votes (party_id TEXT PRIMARY KEY, votes INTEGER)"
    )

    for party in PARTIES:
        cursor = await app.db.execute(
            "SELECT * FROM votes WHERE party_id = ?", (party,)
        )
        party_data = await cursor.fetchone()
        if not party_data:
            await app.db.execute(
                "INSERT INTO votes (party_id, votes) VALUES (?, ?)", (party, 0)
            )

    await app.db.commit()
    return app


web.run_app(app_startup(), port=8080)
