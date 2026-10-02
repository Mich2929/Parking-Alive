import { FaqItem } from '../types';

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Is Where2Park free to use?',
    answer:
      'Yes, 100% free with no subscription, registration, or app-store installation required. Where2Park runs directly in your mobile or desktop web browser and does not collect personal identity data.',
  },
  {
    id: 'faq-2',
    question: 'Where does the carpark availability data come from?',
    answer:
      'Lot availability data is ingested directly from the official LTA DataMall, Housing & Development Board (HDB) Car Park Availability API, and Urban Redevelopment Authority (URA) Carpark Information service under the Singapore Open Data Licence.',
  },
  {
    id: 'faq-3',
    question: 'How accurate is the lot availability count?',
    answer:
      'Data streams directly from Electronic Parking System (EPS) automated barriers at each carpark entry and exit. Barrier telemetry is refreshed every 60 seconds. Minor discrepancies may occur during high-turnover peak rush periods due to vehicles transitioning within the building.',
  },
  {
    id: 'faq-4',
    question: 'Can I use Where2Park without sharing my GPS location?',
    answer:
      'Absolutely. You can manually enter any 6-digit Singapore postal code (e.g. 520284, 238801) or type area names (e.g. "Tampines Central", "Jurong East", "Orchard") into the search bar, or select any of our quick hotspot shortcuts.',
  },
  {
    id: 'faq-5',
    question: 'Does ERP operate on weekends and public holidays?',
    answer:
      'ERP gantries do not operate on Sundays and gazetted Singapore Public Holidays. Certain retail corridor gantries along Orchard Road and the Marina Centre belt operate on Saturdays from 12:00pm to 8:00pm. Weekday expressway gantries cease operation after 20:00.',
  },
];
