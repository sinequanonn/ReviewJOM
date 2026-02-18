#!/bin/bash
# ReviewJOM EC2 초기 설정 스크립트
# Ubuntu 22.04 기준 - EC2 인스턴스에서 최초 1회 실행
# 사용법: chmod +x ec2-setup.sh && sudo ./ec2-setup.sh

set -e

echo "========================================="
echo "  ReviewJOM EC2 초기 설정 시작"
echo "========================================="

# 1. 시스템 업데이트
echo "[1/4] 시스템 업데이트..."
apt-get update -y
apt-get upgrade -y

# 2. Docker 설치
echo "[2/4] Docker 설치..."
apt-get install -y ca-certificates curl gnupg
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 3. Docker 권한 설정
echo "[3/4] Docker 권한 설정..."
usermod -aG docker ubuntu

# 4. Git 설치 및 레포 클론
echo "[4/4] Git 설정..."
apt-get install -y git

echo ""
echo "========================================="
echo "  설정 완료!"
echo "========================================="
echo ""
echo "다음 단계:"
echo "  1. SSH 재접속 (docker 그룹 적용)"
echo "  2. git clone <repository-url> ~/ReviewJOM"
echo "  3. cd ~/ReviewJOM/backend (또는 frontend)"
echo "  4. .env 파일 생성"
echo "  5. docker compose -f docker-compose.prod.yml up -d --build"
echo ""
