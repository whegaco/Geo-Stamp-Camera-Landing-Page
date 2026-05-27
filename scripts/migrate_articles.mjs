import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, setDoc, doc } from 'firebase/firestore';
import { articles } from '../src/data/articles.ts';
import config from '../firebase-applet-config.json';

const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function migrate() {
  console.log('Migrating articles...');
  for (const a of articles) {
    try {
      await setDoc(doc(collection(db, 'articles')), {
        slug: a.slug,
        titleEn: a.titleEn,
        titleAr: a.titleAr,
        excerptEn: a.excerptEn,
        excerptAr: a.excerptAr,
        contentEn: a.contentEn,
        contentAr: a.contentAr,
        date: a.dateEn ? (new Date(a.dateEn).toISOString().split('T')[0] || '2024-01-01') : '2024-01-01',
        authorEn: a.authorEn || 'Editor',
        authorAr: a.authorAr || 'التحرير',
        readTimeEn: a.readTimeEn || '5 min read',
        readTimeAr: a.readTimeAr || '٥ دقائق قراءة',
        image: a.image || '',
        keywordsEn: a.keywordsEn || '',
        keywordsAr: a.keywordsAr || '',
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
      console.log('Added:', a.slug);
    } catch (err) {
      console.error('Failed on', a.slug, err);
    }
  }
  console.log('Migration complete');
  process.exit(0);
}

migrate();
