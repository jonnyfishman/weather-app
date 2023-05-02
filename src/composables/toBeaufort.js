export default function toBeaufort (speed) {
  if (speed > 0 && speed <= 0.2) {
    return 'F1'
  } else if (speed > 0.2 && speed <= 1.5) {
    return 'F2'
  } else if (speed > 1.5 && speed <= 3.3) {
    return 'F3'
  } else if (speed > 3.3 && speed <= 5.4) {
    return 'F4'
  } else if (speed > 5.4 && speed <= 7.9) {
    return 'F5'
  } else if (speed > 7.9 && speed <= 10.7) {
    return 'F6'
  } else if (speed > 10.7 && speed <= 13.8) {
    return 'F7'
  } else if (speed > 13.8 && speed <= 17.1) {
    return 'F8'
  } else {
    return '>F8'
  }
}
