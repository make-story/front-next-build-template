import React from 'react';
import { importDemo } from '@src/common/utils/importDemo';

// https://blog.greenroots.info/understanding-dynamic-imports-lazy-and-suspense-using-react-hooks
const demoData = {
  data: [
    {
      id: 'shape',
      name: 'Shape Demo',
      file: 'shape-demo',
    },
    {
      id: 'color',
      name: 'Color Demo',
      file: 'color-demo',
    },
    {
      id: 'size',
      name: 'Size Demo',
      file: 'size-demo',
    },
  ],
};

const setSelectedDemo = (list: any) => {
  console.log(list);
};

async function loadDemo(filtered: any = []) {
  const promise = filtered.map(async (demo: any = {}) => {
    const Demo = await importDemo(demo?.file);
    return <Demo key={demo?.id} />;
  });

  Promise.all(promise).then(setSelectedDemo);
}

const selectDemo = (file: any) => {
  const filtered: any[] = demoData?.data?.filter((elem: any) => {
    return elem.file === file;
  });
  loadDemo(filtered);
};

const ImportDemo = () => {
  return demoData?.data?.map((demoData: any, index: number) => (
    <React.Fragment key={index}>
      <button onClick={() => selectDemo(demoData.file)}>{demoData.name}</button>{' '}
    </React.Fragment>
  ));
};

export default ImportDemo;
