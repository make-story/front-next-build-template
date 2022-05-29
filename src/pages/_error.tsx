import * as React from 'react';
import { withTranslation } from 'i18n';

interface IError {
  res: any;
  err: any;
  query: any;
}

class Error extends React.Component {
  static async getInitialProps({ res, err, query }: IError) {
    const statusCode = (query?.statusCode && parseInt(query?.statusCode)) || res?.statusCode || err?.statusCode || 404;
    return {
      statusCode,
      namespacesRequired: ['errorPage'],
    };
  }

  componentDidMount() {}

  render() {
    const { statusCode }: any = this.props;
    return <>ERROR!!</>;
  }
}

export default withTranslation('common')(Error as any);
