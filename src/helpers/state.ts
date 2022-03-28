import { getSpreadsheet } from '@/helpers/utils';

export let state = {};

export async function get() {
  const sheetId = '1f4ldYQlU-2a8YD4Ap8bpLoEpz-e0DtaBJCYdsrtmwp0';
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&tq=SELECT%20*`;
  let [gangs, soldiers] = await Promise.all([
    getSpreadsheet(url),
    getSpreadsheet(`${url}&gid=1215049246`)
  ]);

  soldiers = Object.fromEntries(
    soldiers
      .map(soldier => {
        soldier.gangs =
          soldier.gangs && soldier.gangs.includes(',')
            ? soldier.gangs.split(',')
            : soldier.gangs
            ? [soldier.gangs]
            : [];
        return soldier;
      })
      .sort((a, b) => b.gangs.length - a.gangs.length)
      .map(soldier => [soldier.name, soldier])
  );
  console.log('Soldiers', soldiers);

  gangs = Object.fromEntries(
    gangs.map(gang => {
      gang.gangs = gangs.filter(g => g.parent === gang.name).map(g => g.name);
      gang.soldiers = Object.values(soldiers)
        .filter((soldier: any) => {
          let included = false;
          gang.gangs.forEach(g => {
            if (soldier.gangs.includes(g)) included = true;
          });
          return soldier.gangs.includes(gang.name) || included;
        })
        .map((soldier: any) => soldier.name);
      return [gang.name, gang];
    })
  );

  gangs['home'].soldiers = Object.values(soldiers)
    .filter((s: any) => s.gangs.length > 0)
    .map((s: any) => s.name);
  console.log('Gangs', gangs);

  state = { gangs, soldiers };
}
