import { useLiveQuery } from 'dexie-react-hooks'
import { css, styled } from 'twin.macro'
import { db } from '../../dexie/db'
import { DateText, JustText } from '../text'

export function EntryList() {
  const entries = useLiveQuery(() =>
    db.journal.toArray().then(entries => entries.reverse()),
  )

  return (
    <div>
      {entries?.map(entry => (
        <Entry key={entry.id}>
          <DateText>
            {new Date(entry.date).toLocaleString('de-DE', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </DateText>
          <JustText>{entry.content}</JustText>
        </Entry>
      ))}
    </div>
  )
}

export const Entry = styled.div(() => [
  css`
    margin: 0.5rem 0;
  `,
])
