import React from "react";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

export const HelpDescriptionComponent: React.FC<any> = () => {
  return (
    <Typography style={{ fontSize: "12px", position: "absolute", bottom: "0" }}>
      Это приложение можно использвоать для изучения слов каждый день небольшими
      группами слов. В каждой группе слов ровно 10 штук и если каждый день брать
      новую группу, то за 10 дней можно получить словарный запас в 100 слов, и,
      на уроках использвоать данные слова, переводить их из краткосрочной в
      долгосрочную память.
      <br />
      Достаточно лишь каждый день один раз повторять слова и брато один новый
      набор.
      <Divider />
      Для навигации по словам можно использвоать стрелочки на клавиатуре или
      стрелочки (туда ← → сюда) в интерфейсе приложения.
    </Typography>
  );
};
