import type { Metadata } from 'next';
import RangeEditor from '../../components/RangeEditor';

interface EditRangePageProps {
  params: Promise<{
    rangeId: string;
  }>;
}

const RANGE_NAMES: Record<string, { name: string; description: string; category: string }> = {
  'utg': { name: 'UTG (Under The Gun)', description: 'Opening range for the Under The Gun position - the tightest opening range', category: 'Opens' },
  'hj': { name: 'HJ (Hijack)', description: 'Opening range for the Hijack position - slightly wider than UTG', category: 'Opens' },
  'co': { name: 'CO (Cutoff)', description: 'Opening range for the Cutoff position - aggressive late position opens', category: 'Opens' },
  'bu': { name: 'BU (Button)', description: 'Opening range for the Button position - widest opening range with position', category: 'Opens' },
  'sb-open': { name: 'SB Open', description: 'Small Blind opening range when folded to', category: 'Opens' },
  'any-vs-utg': { name: 'Any vs UTG', description: 'Defending and 3-betting range against UTG opener', category: 'Responses' },
  'any-vs-bu': { name: 'Any vs BU', description: 'Defending and 3-betting range against Button opener', category: 'Responses' },
  'any-vs-co': { name: 'Any vs CO', description: 'Defending and 3-betting range against Cutoff opener', category: 'Responses' },
  'bb-vs-ep-mp': { name: 'BB vs EP/MP', description: 'Big Blind defense range against Early and Middle Position', category: 'Blinds' },
  'bb-vs-bu': { name: 'BB vs BU', description: 'Big Blind defense range against Button - wider defense', category: 'Blinds' },
  'bb-vs-sb': { name: 'BB vs SB', description: 'Big Blind defense range against Small Blind - very wide', category: 'Blinds' },
  'sb-vs-ep': { name: 'SB vs EP', description: 'Small Blind response range against Early Position', category: 'Blinds' },
  'sb-vs-mp-lp': { name: 'SB vs MP/LP', description: 'Small Blind response range against Middle and Late Position', category: 'Blinds' },
  'polar-3bet': { name: 'Polar 3Bet', description: 'Polarized 3-bet range with premium hands and bluffs', category: '3Bet' },
  'linear-3bet': { name: 'Linear 3Bet', description: 'Linear 3-bet range with strong value hands', category: '3Bet' },
};

export async function generateMetadata({ params }: EditRangePageProps): Promise<Metadata> {
  const { rangeId } = await params;
  const rangeInfo = RANGE_NAMES[rangeId];
  
  const title = rangeInfo 
    ? `${rangeInfo.name} - Range Editor`
    : `Range ${rangeId} - Editor`;
    
  const description = rangeInfo
    ? `${rangeInfo.description}. Edit and customize your poker hands for ${rangeInfo.name}.`
    : `Custom poker range editor. Configure your hands and labels.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Poker Range Builder`,
      description,
      type: 'website',
      images: ['/og-image.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Poker Range Builder`,
      description,
    },
    robots: {
      index: !!rangeInfo, 
      follow: true,
    },
  };
}

export default async function EditRangePage({ params }: EditRangePageProps) {
  const { rangeId } = await params;
  return <RangeEditor rangeId={rangeId} />;
}
