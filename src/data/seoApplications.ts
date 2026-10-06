export interface SEOApplication {
  slug: string;
  name: string;
  industry: string;
  appCategory: string;
  metaTitle: string;
  metaDescription: string;
  challenge: string;
  solution: string;
  keywords: string[];
}

export const seoApplications: Record<string, SEOApplication> = {
  'carton-sealing': {
    slug: 'carton-sealing',
    name: 'Carton Sealing & Packaging',
    industry: 'Packaging',
    appCategory: 'Packaging',
    metaTitle: 'High-Performance Adhesives for Carton Sealing | DonPack',
    metaDescription: 'Discover our advanced hot-melt adhesives engineered specifically for carton sealing and packaging. Secure, tamper-evident bonding for corrugated boxes.',
    challenge: 'In the fast-paced packaging industry, unexpected pop-opens and weak bonds can lead to product damage, return logistics costs, and brand reputation loss. Standard adhesives often struggle with varying temperatures, dusty environments, and highly recycled corrugated boards.',
    solution: 'DonPack offers specialized high-tack hot-melt adhesives that penetrate deep into recycled fibers, providing instant structural bonds. Our formulations ensure your cartons stay sealed from the production line all the way to the end consumer, resisting extreme transit temperatures and handling stress.',
    keywords: ['carton sealing adhesive', 'packaging glue', 'hot melt for corrugated boxes', 'tamper evident packaging adhesive']
  },
  'furniture-manufacturing': {
    slug: 'furniture-manufacturing',
    name: 'Furniture & Mattress Manufacturing',
    industry: 'Furniture',
    appCategory: 'Furniture',
    metaTitle: 'Industrial Adhesives for Furniture & Mattress Manufacturing | DonPack',
    metaDescription: 'Durable, flexible hot-melt adhesives for furniture assembly, mattress manufacturing, and upholstery. Built to withstand structural demands.',
    challenge: 'Furniture and mattress assembly require adhesives that bond dissimilar materials—like foam, wood, fabric, and plastics—without compromising flexibility or emitting harmful odors. Weak bonds lead to creaking, shifting, or structural failure over time.',
    solution: 'Our furniture-grade adhesives are formulated for high initial tack and long-term flexibility. Whether you are bonding foam layers in mattresses or assembling wooden joints, DonPack adhesives provide a silent, unbreakable bond that moves with the materials while maintaining structural integrity.',
    keywords: ['furniture adhesive', 'mattress glue', 'foam bonding hot melt', 'upholstery adhesive supplier']
  },
  'industrial-glue-guns': {
    slug: 'industrial-glue-guns',
    name: 'Industrial Glue Guns & Applicators',
    industry: 'Manufacturing',
    appCategory: 'Guns',
    metaTitle: 'Heavy-Duty Industrial Glue Guns & Adhesives | DonPack',
    metaDescription: 'Professional-grade hot-melt glue guns and compatible adhesive sticks for continuous industrial manufacturing and assembly lines.',
    challenge: 'Manual and semi-automated assembly lines face downtime when using consumer-grade glue guns that clog, overheat, or fail to maintain consistent adhesive flow during high-volume production.',
    solution: 'DonPack provides rugged, industrial-grade glue guns paired with our premium adhesive sticks. Designed for continuous use, our applicators maintain precise temperatures and consistent flow rates, reducing operator fatigue and eliminating production bottlenecks.',
    keywords: ['industrial glue gun', 'hot melt applicator', 'heavy duty glue gun', 'glue sticks for manufacturing']
  }
};
