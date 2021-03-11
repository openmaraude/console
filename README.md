# Console

This Next.js application is behind [https://console.api.taxi](console.api.taxi) and [https://console.dev.api.taxi](console.dev.api.taxi).


## Usage

### Run

```
# Run using API at https://api.taxi
$> make run_prod

# Run using API at https://dev.api.taxi
$> make run_dev

# Run using API at https://localhost:5000
$> make
$> make run_local
```

### Development

Use [APITaxi_devel](https://github.com/openmaraude/APITaxi_devel).

On OSX, Docker volumes performances are terrible. The best way to develop locally is to install npm on the host with `npm install node`, then:

```
$> npm install
$> npm run dev
```

Console is available at http://localhost:5103.

On Linux, performances should be fine and working with APITaxi_devel should be fine.
