# #!/bin/bash
aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws/o9k5r3t0

Set-Location python-layer

docker build -t panorama-python-layer .

docker tag panorama-python-layer public.ecr.aws/o9k5r3t0/panorama-py:latest

docker push public.ecr.aws/o9k5r3t0/panorama-py:latest

# Set-Location ..

# Set-Location api

# docker build -t panorama-api .

# docker tag panorama-api public.ecr.aws/o9k5r3t0/panorama-api:latest

# docker push public.ecr.aws/o9k5r3t0/panorama-api:latest

# Set-Location ..

# cd .. && cd ui