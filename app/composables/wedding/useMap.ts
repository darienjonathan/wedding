import useGoogleMaps from '~/composables/useMap'

export default () => {
  const receptionMapElementRef = ref<HTMLDivElement>()
  const holyMatrimonyMapElementRef = ref<HTMLDivElement>()
  const { loader } = useGoogleMaps()

  const loadReceptionMap = () => {
    if (!loader.value) return
    const mapElement = receptionMapElementRef.value
    if (!mapElement) return
    loader.value.load().then(() => {
      const position = { lat: -6.2272498, lng: 106.8273196 }

      const infoWindowContent = `
<div class="address">
  <div class="address__title">JW Marriott Hotel Jakarta</div>
  <div class="address__text">Kawasan Mega Kuningan, Jl. Dr. Ide Anak Agung Gde Agung Kav. E.1.2 No 1&2, Jakarta</div>
  <div class="address__link">
    <div class="link__icon material-icons-outlined">map</div>
    <a class="link__href" target="_blank" href="https://goo.gl/maps/EhjPCBC4ENWtDgWeA">Open in Google Maps</a>
  </div>
</div>
    `

      const map = new google.maps.Map(mapElement, {
        center: position,
        zoom: 16,
        mapTypeControlOptions: {
          mapTypeIds: ['ROADMAP'],
        },
        mapId: '67c94aa1464993bf',
      })
      const marker = new google.maps.Marker({
        position,
        map,
      })
      const infoWindow = new google.maps.InfoWindow({ content: infoWindowContent })

      const openInfoWindow = () => {
        infoWindow.open({
          anchor: marker,
          map,
        })
      }
      marker.addListener('click', openInfoWindow)
      openInfoWindow()
    })
  }

  const loadHolyMatrimonyMap = () => {
    if (!loader.value) return
    const mapElement = holyMatrimonyMapElementRef.value
    if (!mapElement) return
    if (!holyMatrimonyMapElementRef.value) return
    loader.value.load().then(() => {
      const position = { lat: -6.145738447315122, lng: 106.81880992882708 }

      const infoWindowContent = `
<div class="address">
  <div class="address__title">Gereja Kristus Yesus Mangga Besar</div>
  <div class="address__text">Jl. Mangga Besar 1 No.74, Mangga Besar, Kec. Taman Sari, Jakarta Barat</div>
  <div class="address__link">
    <div class="link__icon material-icons-outlined">map</div>
    <a class="link__href" target="_blank" href="https://goo.gl/maps/Egin8QAkuvM1ZVE27">Open in Google Maps</a>
  </div>
</div>
    `

      const map = new google.maps.Map(mapElement, {
        center: position,
        zoom: 16,
        mapTypeControlOptions: {
          mapTypeIds: ['ROADMAP'],
        },
        mapId: '67c94aa1464993bf',
      })
      const marker = new google.maps.Marker({
        position,
        map,
      })
      const infoWindow = new google.maps.InfoWindow({ content: infoWindowContent })

      const openInfoWindow = () => {
        infoWindow.open({
          anchor: marker,
          map,
        })
      }
      marker.addListener('click', openInfoWindow)
      openInfoWindow()
    })
  }

  const loadMap = () => {
    loadReceptionMap()
    loadHolyMatrimonyMap()
  }

  onMounted(loadMap)

  return {
    receptionMapElementRef,
    holyMatrimonyMapElementRef,
  }
}
