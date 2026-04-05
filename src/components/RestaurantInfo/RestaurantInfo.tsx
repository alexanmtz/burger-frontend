import styles from './RestaurantInfo.module.css';

interface Props {
  phone: string;
  website: string;
  lat: number;
  lng: number;
  address: string;
  city: string;
  name: string;
}

export function RestaurantInfo({ phone, website, lat, lng, address, city, name }: Props) {
  return (
    <>
      <div className={styles.card}>
        <h3 className={styles.title}>Contact</h3>
        <p className="text-sm text-muted">{phone}</p>
        <a href={website} target="_blank" rel="noopener noreferrer" className={styles.websiteLink}>
          {website.replace('https://', '')} →
        </a>
      </div>
      <div className={styles.mapContainer}>
        <iframe
          title={`Map of ${name}`}
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01},${lat - 0.01},${lng + 0.01},${lat + 0.01}&layer=mapnik&marker=${lat},${lng}`}
          className={styles.mapFrame}
          loading="lazy"
        />
        <p className="text-xs text-muted" style={{ marginTop: 6, textAlign: 'center' }}>
          {address}, {city}
        </p>
      </div>
    </>
  );
}
