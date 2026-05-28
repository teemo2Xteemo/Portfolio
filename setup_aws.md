Để chuẩn bị hạ tầng trên AWS cho luồng CI/CD từ GitHub Actions lên ECS Fargate một cách bài bản và không bị thiếu sót, bạn cần thực hiện theo một trình tự tuyến tính vì các tài nguyên này có sự phụ thuộc lẫn nhau (ví dụ: phải có Security Group trước mới tạo được ALB, phải có Target Group mới tạo được ECS Service).

Dưới đây là cẩm nang chi tiết từng bước thiết lập trực tiếp trên AWS Management Console.

---

### Bước 1: Chuẩn bị Mạng và Tường lửa (VPC & Security Groups)

Nếu bạn dùng **VPC mặc định (Default VPC)** của AWS, bạn có thể bỏ qua phần tạo VPC và tiến hành tạo ngay 2 Security Group (SG) sau:

1. **Tạo Security Group cho ALB (Ví dụ đặt tên: `alb-sg`):**

- Vào **EC2** > **Security Groups** > Chọn **Create security group**.
- Chọn VPC của bạn.
- Tại mục **Inbound rules** (Quy tắc vào), bấm **Add rule**:
- **Type:** Chọn `HTTP`.
- **Source:** Chọn `Anywhere-IPv4` (`0.0.0.0/0`).

- Bấm **Create security group**.

2. **Tạo Security Group cho ECS Task (Ví dụ đặt tên: `ecs-task-sg`):**

- Bấm tiếp **Create security group**.
- Tại mục **Inbound rules**, bấm **Add rule**:
- **Type:** Chọn `Custom TCP`.
- **Port range:** Điền `80` (Vì container Nginx của bạn chạy port 80).
- **Source:** Thay vì chọn mã IP, bạn gõ và chọn chính cái tên `alb-sg` (Security Group của ALB vừa tạo ở trên).

- Bấm **Create security group**.

---

### Bước 2: Tạo kho chứa Docker Image (Amazon ECR)

1. Trên thanh tìm kiếm AWS, gõ và chọn dịch vụ **Elastic Container Registry (ECR)**.
2. Ở menu bên trái, chọn **Repositories** > Bấm **Create repository**.
3. **Visibility settings:** Chọn `Private`.
4. **Repository name:** Điền tên project của bạn (ví dụ: `react-nginx-app`).
5. Các mục khác giữ nguyên mặc định, kéo xuống dưới cùng và bấm **Create repository**.
6. _Sau khi tạo xong, hãy copy lại chuỗi **URI** của repository này để điền vào file GitHub Actions sau này._

---

### Bước 3: Cấu hình quyền cho GitHub Actions (IAM User)

GitHub Actions cần một bộ chìa khóa (Access Key) để có quyền đẩy image vào ECR và ra lệnh cho ECS cập nhật.

1. Tìm và mở dịch vụ **IAM** (Identity and Access Management).
2. Tại menu bên trái, chọn **Users** > Bấm **Create user**.
3. **User name:** Đặt tên (ví dụ: `github-actions-deployer`) > Bấm **Next**.
4. Tại màn hình "Set permissions", tích chọn mục **Attach policies directly**.
5. Trong ô tìm kiếm chính sách, tìm và tích chọn 2 quyền sau:

- `AmazonEC2ContainerRegistryPowerUser` (Để push Docker image vào ECR).
- `AmazonECS_FullAccess` (Để cập nhật và deploy Task trên ECS).

6. Bấm **Next** > Bấm **Create user**.
7. Bấm vào cái tên User vừa tạo > Chuyển sang tab **Security credentials**.
8. Kéo xuống mục **Access keys** > Bấm **Create access key**.
9. Chọn mục **Command Line Interface (CLI)** > Tích chọn cam kết > Bấm **Next** > **Create access key**.
10. **QUAN TRỌNG:** Tải file `.csv` hoặc copy lại **Access Key ID** và **Secret Access Key**. Đây là thông tin duy nhất để dán vào GitHub Secrets, AWS sẽ không hiển thị lại lần hai.

---

### Bước 4: Tạo Application Load Balancer & Target Group

_(Bước này bạn đã thực hiện ở các câu hỏi trước, hãy đảm bảo chọn đúng: Type là Internet-facing, Target Group loại IP addresses, Port 80 và gắn đúng các Security Group tương ứng đã tạo ở Bước 1)._

---

### Bước 5: Tạo ECS Cluster và Task Definition

1. **Tạo Cluster:**

- Mở dịch vụ **Elastic Container Service (ECS)** > **Clusters** > **Create cluster**.
- Đặt tên Cluster (ví dụ: `react-production-cluster`).
- Tại mục **Infrastructure**, tích chọn **AWS Fargate (serverless)**.
- Bấm **Create**.

2. **Tạo Task Definition:**

- Tại menu bên trái của ECS, chọn **Task definitions** > **Create new task definition** > Chọn **Create new task definition with JSON**.
- Bạn có thể dán cấu hình JSON cơ bản dưới đây vào (sau đó chỉnh sửa lại các thông số trong dấu `<...>`):

```json
{
  "family": "react-task-def",
  "containerDefinitions": [
    {
      "name": "react-container",
      "image": "<ĐIỀN_URI_ECR_CỦA_BẠN_Ở_BƯỚC_2>:latest",
      "cpu": 0,
      "portMappings": [
        {
          "name": "react-container-80-tcp",
          "containerPort": 80,
          "hostPort": 80,
          "protocol": "tcp"
        }
      ],
      "essential": true,
      "essential": true
    }
  ],
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512"
}
```

- Bấm **Create** để hoàn thành. Sau khi tạo xong, hãy chuyển sang tab JSON của Task Definition này, copy nội dung về máy và lưu thành file `task-definition.json` trong source code như hướng dẫn ban đầu.
