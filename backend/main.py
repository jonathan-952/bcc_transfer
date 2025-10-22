from fastapi import FastAPI
# api endpoints:
#   fetch a degree by id
#   fetch all requirements by degree id
#   fetch courses by requirement id
# 

app = FastAPI()

@app.get('/')
async def main():
    return 

@app.get('/degree/${id}')
async def get_degree(id: int):
    # 
    return

