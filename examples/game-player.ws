// WEBSCRIPT — Game Entity Declaration
// authored by Peace Thabiwa, SAGEWORKS AI
player of world {
position : orbit(spawn, 0)
health   : 100
boundary : circle(phi * 20)
depth    : phi * 100
}
camera of world {
position : orbit(player, 0)
smooth   : harmonic(0.3)
}
player.rotation = cursor.angle * harmonic(0.2)
3 orbital nodes of player
