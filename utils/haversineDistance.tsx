const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    //earth radius
    const R = 6371

    //radian convert
    const toRad = (angle: number) => (angle * Math.PI) / 180
  
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    //result distance km
    return R * c
  }

export default haversineDistance