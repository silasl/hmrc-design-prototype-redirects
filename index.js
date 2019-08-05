const app = require('./src/app')

// DON'T USE A PORT YOU ENJOY!!
const port = process.env.PORT || 7231

app.listen(port, () => console.log(`Listening on port ${port}`))