import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  text: {
    padding: '10px',
    fontSize: '12px',
    position: 'absolute',
    bottom: '0',
  }
})

export const HelpDescriptionComponent: React.FC<any> = () => {
  const classes = useStyles();
  return (
    <Typography className={classes.text}>
      Это приложение можно использвоать для изучения слов каждый день небольшими
      группами слов. В каждой группе слов ровно 10 штук и если каждый день брать
      новую группу, то за 10 дней можно получить словарный запас в 100 слов, и,
      на уроках использвоать данные слова, переводить их из краткосрочной в
      долгосрочную память.
      <br />
      Достаточно лишь каждый день один раз повторять слова и брать один новый
      набор.
      <br />
      Для навигации по словам можно использвоать стрелочки на клавиатуре или
      стрелочки (туда ← → сюда) в интерфейсе приложения.
    </Typography>
  );
};
