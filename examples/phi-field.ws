// WEBSCRIPT — Phi Field
// authored by Peace Thabiwa, SAGEWORKS AI
field of viewport {
topology : radial(phi)
depth    : phi * 300
motion   : harmonic(0.2)
}
5 harmonic layers of field
every orbital node {
radius : phi ^ self.index * 28
color  : hue(self.angle)
influence : cursor.field
}
