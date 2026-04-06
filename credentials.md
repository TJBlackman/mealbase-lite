I can't log into my old mealbase db.

Here's what I have tried:

- mongosh -u admin -p password
- mongosh -u admin -p P@ssw0rd!
- mongosh - trevor -p P@ssword!
- mongosh -u UZKhBdzrfHkR9twe -p wYyk3fMP!WnBqdRAha9XtxQVpEcuNHKv4-zGj\*sr7S82CJe6FU
- mongosh -u UZKhBdzrfHkR9twe -p wYyk3fMP\!WnBqdRAha9XtxQVpEcuNHKv4-zGj\*sr7S82CJe6FU

use admin
db.auth("admin", "password")
db.auth("trevor", "epson2")
db.auth("", "epson2")
db.auth("UZKhBdzrfHkR9twe", "P@ssw0rd!")
db.auth("UZKhBdzrfHkR9twe", "wYyk3fMP!WnBqdRAha9XtxQVpEcuNHKv4-zGj\*sr7S82CJe6FU")

db.adminCommand("listDatabases")
