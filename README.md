# Test Service

A micro service that manages organisations' test results. We have abstracted other aspects such as authentication.

![Entity Relationships](test.svg "Entity Relationships")

Above shows the entity relationship between an organisation (`organisation`), its users (`profile`) and their test results (`sample`)
# Local Development
## Prerequisites
* node v10
* npm
## Instructions
1. run this command
``` 
docker compose down -v && docker compose up -d --build 
```
2. Go to `http://localhost:9080/swagger/` to interact with APIs
3. if you wanted to dummy data can use this script
```
node testing_data_import/import_dummy_data.js 
```
API format follows JSON:API (https://jsonapi.org/)
### Create a profile
```
curl --location --request POST 'http://localhost:8080/test/v1.0/org/84298aa5-27a9-4d54-a357-d8cbe174bb39/profile' \
--header 'Content-Type: application/json' \
--data-raw '{
    "data": {
        "type": "profile",
        "attributes": {
            "name": "John Wayne"
        }
    }
}'
```

### Read a profile
```
curl --location --request GET 'http://localhost:8080/test/v1.0/org/84298aa5-27a9-4d54-a357-d8cbe174bb39/profile/c072284e-eb1f-4294-b06c-26c010a3b4eb'
```

### Add a sample
```
curl --location --request POST 'http://localhost:8080/test/v1.0/org/84298aa5-27a9-4d54-a357-d8cbe174bb39/profile/c072284e-eb1f-4294-b06c-26c010a3b4eb/sample' \
--header 'Content-Type: application/json' \
--data-raw '{
    "data": {
        "type": "result",
        "attributes": {
            "sampleId": "12345678",
            "resultType": "rt-pcr"
        }
    }
}'
```

### Read a sample
```
curl --location --request GET 'http://localhost:8080/test/v1.0/org/84298aa5-27a9-4d54-a357-d8cbe174bb39/profile/c072284e-eb1f-4294-b06c-26c010a3b4eb/sample/12345678'
```

# Docker Deployment
## Prerequisites
* Docker (https://docs.docker.com/get-docker/)
* Docker Compose (https://docs.docker.com/compose/install/)
## Instructions
* `docker-compose up -d --build` -- Build and set up swagger, postgres and service
* `docker-compose down --rmi all` -- Shutdown and clean up
* Go to `http://localhost:9080/swagger/` to interact with APIs

## Manual Testing Steps

###### Step 1: Pagination
GET request to your endpoint with limit=2 and offset=1.
```
curl "http://localhost:3000/api/search?limit=2&offset=1"
```
Expected: You get 2 results, not the whole dataset.

###### Step 2: Search by patient name
Send a GET request with patientname=Bruce Lee.
```
curl "http://localhost:3000/api/search?patientname=Bruce%20Lee"
```
Expected: Only results for Bruce Lee are returned.
###### Step 3: Extra fields for special organisation
As an org named "Circle", send a request and check that the response includes type and patientId attributes.
As another org, send the same request and check that those fields are not included.

###### Step 4: Search by patient ID
Send a GET request with patientid=de8f4e03-bfca-483f-b356-e952ba8136f5.
```
curl "http://localhost:3000/api/search?patientid=de8f4e03-bfca-483f-b356-e952ba8136f5"
```
Expected: Only results for that patient ID.


#### Testing only
1. if you wanted to load data can load dummy data like this
2. ``` node  ```
#### All automation test is here..
```
test/search.test.ts
start DB or use local DB
nom run test
```
