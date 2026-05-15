// WEBSCRIPT — Pattern 3: Equation Constraint
// authored by Peace Thabiwa, SAGEWORKS AI
card {
depth : 300
}
card.rotation = cursor.angle * harmonic(0.4)
card.scale    = distance(origin) ^ 0.5
card.opacity  = 1 - (distance(cursor) / viewport.diagonal)
