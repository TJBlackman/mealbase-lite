### Initial Server Setup

- Server OS is "Amazon Linux 2023"
- Install Docker

```sh
sudo yum update -y
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user
sudo docker swarm init
```

- Configure AWS CLI

  - `aws configure` - follow the prompts, enter credentials

- Use Certbot to get SSL certs
  - You don't need a running HTTP server, certbot will do that for you. You just need your domain to be pointing at the server you're running on.

```sh
sudo dnf install python3 augeas-libs -y
sudo python3 -m venv /opt/certbot/
sudo /opt/certbot/bin/pip install --upgrade pip
sudo /opt/certbot/bin/pip install certbot
sudo ln -s /opt/certbot/bin/certbot /usr/bin/certbot
sudo certbot certonly
```

- Create a `mongodb/` folder where ever you want it.

- Add envs to the host machine
  - `sudo nano /etc/environment`
  - `ENV="VALUE"`
- copy files to machine and run `docker compose up`
