# CIDR Calculator - Production Deployment

A production-ready CIDR Calculator web application with automated deployment to Google Kubernetes Engine.

## Features

### CIDR Tools
- CIDR to IP Range conversion with network details
- IP Range to CIDR converter
- Subnet calculator (by count or hosts)
- Netmask converter (CIDR/subnet/wildcard masks)
- CIDR overlap checker and conflict resolver

### Technical
- Next.js 15 with TypeScript
- Server-side validation
- Responsive design
- Dark/Light theme
- Auto-scaling deployment
- Production-grade security

## Quick Start

### Prerequisites
```bash
gcloud version
terraform version
kubectl version
docker --version
```

### Deploy

```bash
# Configure
cd terraform
cp terraform.tfvars.example terraform.tfvars
nano terraform.tfvars  # Update credentials_file and project_id

# Deploy infrastructure
terraform init
terraform apply

# Deploy application
gcloud container clusters get-credentials cidr-calculator-gke-cluster --zone us-central1-a
kubectl apply -f k8s/
kubectl get ingress cidr-calculator-ingress  # Wait for IP
```

## Configuration

### Terraform Variables

| Variable | Description | Default |
|----------|-------------|---------|
| credentials_file | Path to GCP service account JSON | Required |
| project_id | GCP Project ID | Required |
| project_name | Resource naming prefix | cidr-calculator |
| region | GCP region | us-central1 |
| zone | GCP zone | us-central1-a |
| gke_num_nodes | Initial node count | 1 |
| machine_type | Node type | e2-small |

### Using Your Docker Image

Edit `k8s/deployment.yaml`:
```yaml
image: your-username/cidr-calculator:latest
```

For private registries:
```bash
kubectl create secret docker-registry regcred \
  --docker-server=<server> \
  --docker-username=<user> \
  --docker-password=<password>
```

## Infrastructure

### GCP Resources
- VPC Network (10.0.0.0/24)
- GKE Zonal Cluster
- 1x e2-small node (preemptible)
- 30GB standard disk
- Global Load Balancer

### Architecture
```
Internet → Load Balancer → VPC → GKE → Pods
```

## Operations

### Monitoring
```bash
kubectl get all
kubectl logs -l app=cidr-calculator
kubectl top pods
kubectl get events
```

### Scaling
```bash
kubectl scale deployment cidr-calculator --replicas=2
kubectl get hpa
```

### Updates
```bash
kubectl set image deployment/cidr-calculator cidr-calculator=newimage:tag
kubectl rollout status deployment/cidr-calculator
```

### Port Forward (Testing)
```bash
kubectl port-forward service/cidr-calculator-service 8080:80
```

## Troubleshooting

### Pod Issues
```bash
kubectl describe pod <pod-name>
kubectl logs <pod-name>
kubectl logs <pod-name> --previous
```

### Ingress No IP (wait 5-10 min)
```bash
kubectl describe ingress cidr-calculator-ingress
kubectl get endpoints
```

### Common Fixes
```bash
kubectl delete pod <pod-name> --force
kubectl rollout restart deployment/cidr-calculator
```

## Cleanup

```bash
kubectl delete -f k8s/
cd terraform && terraform destroy
```

## CI/CD

GitHub Actions workflows:
- `.github/workflows/ci.yml` - Lint and build (ignores terraform/, k8s/, *.md)
- `.github/workflows/docker-build.yml` - Build Docker image
- `.github/workflows/version-bump.yml` - Automated versioning

## Security

- Credentials never committed
- Pods in private VPC
- Kubernetes Secrets for sensitive data
- Auto-upgrade enabled
- Workload Identity configured

## License

MIT

---

**Tech Stack:** Next.js · TypeScript · Tailwind CSS · Kubernetes · Terraform · GCP
