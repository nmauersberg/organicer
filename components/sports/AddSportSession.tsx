import { FadeIn } from 'anima-react';
import { SlideButton } from '../button/SlideButton';
import { SportSession, useDexieDb } from '../../dexie/db';
import { toast } from 'react-hot-toast';

const emptySession: SportSession = {
  date: new Date().toISOString(),
  rounds: [],
};

export const AddSportSession = () => {
  const [db] = useDexieDb();

  const addSportSession = async () => {
    try {
      await db.sports.add(emptySession);
      toast.success('Session angelegt!');
    } catch (error) {
      toast.error('Session konnte nicht angelegt werden!');
    }
  };

  return (
    <FadeIn orientation="up" duration={0.5} delay={0.25} distance={30}>
      <SlideButton onClick={() => addSportSession()}>
        Neue Session starten
      </SlideButton>
    </FadeIn>
  );
};
