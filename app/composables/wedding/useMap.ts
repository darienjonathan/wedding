import type { WeddingEvent } from 'types/model/wedding/weddingSettings'
import useGoogleMaps from '~/composables/useMap'

export const useMap = (weddingEvents: Ref<WeddingEvent[]>) => {
  const { loader } = useGoogleMaps()

  const mapElementRefs = ref<HTMLDivElement[]>([])

  const loadMaps = () => {
    mapElementRefs.value.forEach((mapElement, index) => {
      if (!loader.value) return
      if (!mapElement) return

      const weddingEvent = weddingEvents.value[index]
      if (!weddingEvent) return

      const loadMapLibrary = loader.value.importLibrary('maps')
      const loadMarkerLibrary = loader.value.importLibrary('marker')
      Promise.all([loadMapLibrary, loadMarkerLibrary]).then(
        () => {
          const position = weddingEvent.centerCoordinate

          const infoWindowContent = `
  <div class="address">
    <div class="address__title">${weddingEvent.venue}</div>
    <div class="address__text">${weddingEvent.address}</div>
    <div class="address__link">
      <div class="link__icon material-icons-outlined">map</div>
      <a class="link__href" target="_blank" href="${weddingEvent.gmapsLink}">Open in Google Maps</a>
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
          const marker = new google.maps.marker.AdvancedMarkerElement({
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
        }
      )
    })
  }

  watchEffect(loadMaps)

  return {
    mapElementRefs,
  }
}
