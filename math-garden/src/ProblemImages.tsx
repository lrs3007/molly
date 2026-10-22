import type { ProblemImage } from './content';
export default function ProblemImages({ images }: { images?: ProblemImage[] }) {
  if (!images?.length) return null;
  return <div className="problem-images">{images.map(image => <figure key={image.src}>
    <a href={image.src} target="_blank" rel="noreferrer" aria-label={`查看原图：${image.alt}`}><img src={image.src} alt={image.alt} loading="lazy" decoding="async"/></a>
    <figcaption>{image.caption}<span>点击图片查看大图</span></figcaption>
  </figure>)}</div>;
}
