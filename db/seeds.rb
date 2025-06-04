# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

puts "Creando usuarios de ejemplo..."

User.find_or_create_by!(email: "usuario@dataview.com") do |user|
  user.password = "123456"
  user.password_confirmation = "123456"
  user.first_name = "Usuario"
  user.last_name = "Ejemplo"
  user.confirmed_at = Time.now
  user.country = "Estados Unidos"
end

User.find_or_create_by!(email: "admin@dataview.com") do |user|
  user.password = "123456"
  user.password_confirmation = "123456"
  user.first_name = "Administrador"
  user.last_name = "Ejemplo"
  user.admin = true
  user.confirmed_at = Time.now
  user.country = "España"
end

puts "Usuarios creados:"
puts "Email: usuario@dataview.com | Password: 123456"
puts "Email: admin@dataview.com   | Password: 123456"
