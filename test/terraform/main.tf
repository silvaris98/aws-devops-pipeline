provider "aws" {
  region = "eu-north-1"
}

resource "random_id" "instance" {
  byte_length = 4
}

resource "aws_instance" "app" {
  ami                    = var.ami_id
  instance_type          = "t3.micro"
  vpc_security_group_ids = ["sg-0358ebca16e7ee6b5"] # ඔබගේ දැනට පවතින Security Group එක මෙහි යොදා ඇත[cite: 2]

  user_data = <<-EOT
    #!/bin/bash
    set -e
    apt-get update -y
    apt-get install -y docker.io
    systemctl start docker
    docker pull wasuaa/spacexp-sample:latest
    docker run -d --name myapp -p 8080:8080 --restart=always wasuaa/spacexp-sample:latest
  EOT

  tags = {
    Name = "ci-cd-app-${random_id.instance.hex}"
  }
}

variable "ami_id" {
  type = string
}

output "public_ip" {
  value = aws_instance.app.public_ip
}
