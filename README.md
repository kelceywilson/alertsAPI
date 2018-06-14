# alertsAPI

## To Install & Run Locally
1. npm install
2. npm run db:create
3. npm start
:warning: Creates alerts MongoDB and runs server on port 5000

## Alerts Endpoint
| Request | URL | Action |
| :--- | :--- | :--- |
| POST | `/alerts` | CREATES new alert |
| GET | `/alerts` | READS all alerts |
| GET | `/alerts/:id` | READS one alert |
| PUT | `/alerts/:id` | UPDATES one alert (WIP) |
| DELETE | `/alerts/:id` | DELETES one alert |

#### Sample Response

GET `/alerts`

```js
{
  alerts: [
    {
      "createdAt": "2018-04-27T19:02:56.283Z",
      "updatedAt": "2018-04-27T19:02:56.283Z",
      "_id": "563970891719c56cac83e5bb",
      "alert_type": "Sale",
      "title": "Groovy Thing",
      "__v": 0
    },
    {
      "createdAt": "2018-04-27T19:02:52.490Z",
      "updatedAt": "2018-04-27T19:02:52.490Z",
      "_id": "5ae373dcf489c0fe89735e8e",
      "alert_type": "Wanted",
      "title": "Groovy Thing",
      "__v": 0
    }
  ]
}
```

## TODO
Make search case-insensitive.
