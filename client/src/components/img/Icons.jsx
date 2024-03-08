import L from 'leaflet';

export const icon_black = L.icon({
  iconSize: [2, 2],
  iconAnchor: [0, 0],
  popupAnchor: [2, -40],
  iconUrl: require('../../components/img/black-square.png'),
});

export const icon_green = L.icon({
  iconSize: [30, 30],
  iconUrl: require('../../components/img/greencircle.png'),
});

export const icon_flag = L.icon({
  iconSize: [20, 20],
  iconUrl: require('../../components/img/raceflag.png'),
});
