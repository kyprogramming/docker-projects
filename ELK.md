# ELK Stack - Docker Configuration

ELASTICSERACH/ LOGSTASH / KIBANA
``` 
   elasticsearch:
        image: docker.elastic.co/elasticsearch/elasticsearch:8.9.0
        environment:
            # - ELASTIC_PASSWORD=P@ssw0rd123 # Password for the "elastic" user
            # - xpack.security.enabled=true            # Enable security features
            - xpack.security.transport.ssl.enabled=false
            - "ES_JAVA_OPTS=-Xms1g -Xmx1g"
            - discovery.type=single-node
            - xpack.security.enabled=false # Disable security features (or set to true if you want to enable security)
            # - xpack.monitoring.enabled=true
            # - xpack.monitoring.elasticsearch.hosts=["http://elasticsearch:9200"]
            - http.cors.enabled=true
            - http.cors.allow-origin=http://localhost:3000
            - http.cors.allow-credentials=true
            - http.cors.allow-methods=OPTIONS,HEAD,GET,POST,PUT,DELETE
        ports:
            - "9200:9200"  # Elasticsearch HTTP
            - "9300:9300"  # Transport
        container_name: elasticsearch
        volumes:
            - es_data:/usr/share/elasticsearch/data
        # restart: always

    logstash:
        image: docker.elastic.co/logstash/logstash:8.9.0
        container_name: logstash
        environment:
            ELASTICSEARCH_HOST: http://elasticsearch:9200
            LS_JAVA_OPTS: "-Xmx256m -Xms256m"  # Adjust based on your system resources
            # - ELASTICSEARCH_USERNAME=elastic
            # - ELASTICSEARCH_PASSWORD=P@ssw0rd123
        ports:
            - "5044:5044" # For HTTP or Beats input
            - "9600:9600" # For monitoring
        volumes:
            - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf:ro
            # - ./logstash.yml:/usr/share/logstash/config/logstash.yml:ro
        depends_on:
            - elasticsearch
        # restart: always

    
    kibana:
      image: docker.elastic.co/kibana/kibana:8.9.0
      container_name: kibana
      environment:
          - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
      #  - ELASTICSEARCH_USERNAME=elastic         # Use the "elastic" user
      #  - ELASTICSEARCH_PASSWORD=P@ssw0rd123
      #  - ELASTICSEARCH_SERVICE_ACCOUNT_TOKEN=AAEAAWVsYXN0aWMva2liYW5hL2tpYmFuYS10b2tlbjpha3VvWmJWZFFTR20ydVlNSC1vdkt3
      ports:
          - "5601:5601"
      depends_on:
          - elasticsearch

networks:
    default:

volumes:
    mongodb_data:
    redis_data:
    es_data:
        driver: local
        
```

logstash.conf
``` 
input {
  http {
    host => "0.0.0.0"
    port => 5044
    codec => json
    response_headers => {
        "Access-Control-Allow-Origin" => "*"
        "Content-Type" => "text/plain"
        "Access-Control-Allow-Headers" => "Origin, X-Requested-With, Content-Type, Accept"
    }
  }
}

filter {
  if [http][method] == "OPTIONS" {
    drop { }
  }
  json {
    source => "message"
    # target => "parsed_json"
  }
}

output {
    elasticsearch {
        hosts => ["http://elasticsearch:9200"]
        index => "ng-app-log-index"
    }
    stdout { codec => json_lines}
}

```

verify 

```
ELASTICSEARCH
curl http://localhost:9200
curl -X GET "http://localhost:9200/_cluster/health?pretty"
# command to execute
bin/elasticsearch-service-tokens create elastic/kibana kibana-token
SERVICE_TOKEN elastic/kibana/kibana-token = AAEAAWVsYXN0aWMva2liYW5hL2tpYmFuYS10b2tlbjpha3VvWmJWZFFTR20ydVlNSC1vdkt3

```

```
LOGSTASH
docker logs logstash | grep "elasticsearch"
```

```
KIBANA
http://localhost:5601/api/status
http://localhost:5601/app/home#/
```
```
Check if Logstash is sending data to Elasticsearch

curl -X GET "http://localhost:9200/_cat/indices?v"

CREATE INDEX
curl -X PUT "http://localhost:9200/my_index"
curl -X GET "http://localhost:9200/_cat/indices?v"
curl -X GET "http://localhost:9200/my-index/_search?pretty"
curl -X GET "http://localhost:9200/ng-app-log-index/_search?pretty"

curl -X POST "http://localhost:9200/your-index-name/_doc" -H 'Content-Type: application/json' -d'
{
  "message": "Hello Elasticsearch!"
}'

```

```
Angular to Stash 
curl -H "Origin: http://localhost:4200" -X POST "http://localhost:5044" -d '{"test": "data"}

```
DELETE AND CREATE NEW iNDEX
DELETE /ng-app-log-index

PUT /ng-app-log-index
{
  "mappings": {
    "properties": {
      "message": {
        "type": "object"
      }
    }
  }
}
```
loggerService.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private logstashUrl = 'http://localhost:5044';

  constructor(private http: HttpClient) {}

  sendLog(message: any): Observable<any> {
    const logData = {
      message: message, // Pass the object directly
      app: 'ng-app',
      timestamp: new Date().toISOString(),
      level: 'info',
    };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.logstashUrl, logData, { headers });
  }
}

```

```
App.component.html
<br>

<h1>Send log on a button click</h1>
<div>
    <button (click)="onLogButtonClick()">Send Log to Logstash</button>
</div>

App.component.ts

  constructor(
    private fetchDataService: FetchDataService,
    private loggerService: LoggerService
  ) {}

  onLogButtonClick() {
    // const message = 'Button clicked: Sending log message to Logstash!';
    const message = {"test": "data"};
    this.loggerService.sendLog(message).subscribe(
      (response) => {
        console.log('Log sent successfully:', response);
      },
      (error) => {
        console.error('Error sending log:', error);
      }
    );
  }

```


```
DIRECT CONNECTIVITY WITH 

const ELASTICSEARCH_URL = "http://localhost:9200/your-index/_doc"; // Your Elasticsearch URL
```
<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

# Docker Compose Installation:
```
docker-compose --version
```


<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
