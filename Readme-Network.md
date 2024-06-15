#  <span style="color: red;">Docker Network Commands:</span>


## <span style="color: yellow;">1. Bridge Network</span>
#### Create a Bridge Network

```
docker network create my_bridge_network
```
#### Run Containers on the Bridge Network
```
docker run -d --name container1 --network my_bridge_network nginx
docker run -d --name container2 --network my_bridge_network nginx
```

#### Communicate Between Containers
```
docker exec -it container1 sh
ping container2
apt-get update && apt-get install -y iputils-ping
```

#### Inspect Network
```
docker network inspect my_bridge_network
```

#### Connect/Disconnect a Running Container to a Network
```
docker network connect my_bridge_network container1
docker network disconnect my_bridge_network container1
```

## <span style="color: yellow;">2. Host Network</span>
#### Create a Host Network (Not supported on Docker Desktop for Mac and Windows)
```
docker network create -d host my_host_network
```

## <span style="color: yellow;">3. Overlay Network</span>
#### Enable Swarm Mode for Overlay Network
```
docker swarm init
docker network create -d overlay my_overlay_network
docker service create --name my_service --network my_overlay_network nginx
```

## <span style="color: yellow;">4. Macvlan Network</span>
#### Create a Macvlan Network
```
docker network create -d macvlan --subnet=192.168.1.0/24 --gateway=192.168.1.1 -o parent=eth0 my_macvlan_network
```

## <span style="color: yellow;">5. None Network</span>
```
docker run --rm -d --network none nginx sleep 1000
```

#  <span style="color: green;">Verify Networks</span>
```
docker network ls
```

#  <span style="color: red;">Clean Up: Remove Networks</span>
```
docker rm -f container1 container2
docker network rm my_bridge_network my_host_network my_overlay_network my_macvlan_network
docker swarm leave --force
```