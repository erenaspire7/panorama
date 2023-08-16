# Panorama

### API Setup

To begin, open your preferred terminal, and change the directory to the api folder

```
cd api && npm i -D
```

Then, create an .env file within the api folder, and add the local database url. Ensure you replace user and password with your db values.

```
DATABASE_URL="postgresql://{user}:{password}@localhost:5432/panorama"
```


```
npx prisma migrate dev
```