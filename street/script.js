const btn = document.getElementById("btn")
const out = document.getElementById("output")

btn.onclick = async () => {
  out.textContent = "Getting location..."
  if (!navigator.geolocation) {
    out.textContent = "Geolocation not supported"
    return
  }

  navigator.geolocation.getCurrentPosition(async pos => {
    const { latitude, longitude } = pos.coords
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
    try {
      const res = await fetch(url, { headers: { "User-Agent": "get-my-address" } })
      const data = await res.json()
      const address = data.address
      const street = address.road || address.pedestrian || address.path || "Unknown street"
      const zip = address.postcode || "Unknown ZIP"
      const result = `${street}, ${zip}`
      out.textContent = result
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(result)
        out.textContent += " (copied!)"
      }
    } catch {
      out.textContent = "Error fetching address"
    }
  }, () => out.textContent = "Permission denied")
}
