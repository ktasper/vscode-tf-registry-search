# What
An extension for vscode that lets you search hashicorp registry for docs on cloud resources
# How
Simply select the word or function you want to search, then right click and click on `Search with Terraform Registry` in drop-down menu.

Say you have a resource defined like `resource "aws_s3_bucket" "foo" {` this splits the `aws` and the `s3_bucket` and
searches for [https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket)

# Why
When refactoring lots of terraform code, I always needed to copy and paste the resource definition into google, find the docs, this speeds that process up a little bit.

# What I work with
Here are the following providers I have tested it to work with, because 
- AWS
- GCP
- AZURE
- Kubernetes
- Helm
As long as the provider name is the first item in the resource definition this **should** work.

# Screenshots
![](/static/search1.jpg)


![](/static/search2.jpg)
