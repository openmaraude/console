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


## Deployment

To deploy to production, setup the following remote and push on the master branches.

```
git remote add clever-dev git+ssh://git@push-n2-par-clevercloud-customers.services.clever-cloud.com/app_a3a512d9-fe86-449d-a448-bb4803b0c74f.git
git remote add clever-prod git+ssh://git@push-n2-par-clevercloud-customers.services.clever-cloud.com/app_8ff05f72-5456-434b-ae0a-6083201f8061.git
```

To connect to containers, install [CleverCloud CLI](https://www.clever-cloud.com/doc/reference/clever-tools/getting_started/) and run the following commands:

```
clever link app_a3a512d9-fe86-449d-a448-bb4803b0c74f
clever link app_8ff05f72-5456-434b-ae0a-6083201f8061

# Outputs "dev-console" and "prod-console"
clever applications

clever ssh -a dev-console
clever ssh -a prod-console
```
