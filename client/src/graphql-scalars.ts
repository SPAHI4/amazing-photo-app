import { FieldPolicy } from '@apollo/client';
import parseISO from 'date-fns/esm/parseISO';

export const datetimeTypePolicy: FieldPolicy<Date | null, Date | string | null> = {
  merge: (_, incoming) => {
    if (incoming == null) {
      return incoming;
    }
    if (incoming instanceof Date) {
      return incoming;
    }
    return parseISO(incoming as string);
  },
};
