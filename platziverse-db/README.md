# platziverse-db
## Usage

``` js
const setupDataBase = required("latziverse-db")

setupDatabase(config).then(db => {
  const { Agent, Metric } = db
}).catch( err => console.error(err))

```
