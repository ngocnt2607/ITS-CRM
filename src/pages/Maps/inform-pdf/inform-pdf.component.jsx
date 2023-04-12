import React, { useCallback, useEffect, useState } from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Font,
  Image,
} from '@react-pdf/renderer';
import logo from '../../../assets/images/leeon_logo-04.png';
import { InformCdrAPI } from '../../../api/inform-cdr.api';
import { toast } from 'react-toastify';

// Create styles
const styles = StyleSheet.create({
  body: {
    padding: 20,
  },
  image: {
    width: 161,
    height: 80,
    margin: '0 auto',
  },
  header: {
    marginTop: 10,
  },
  text: {
    fontSize: 12,
    fontWeight: 400,
    color: 'gray',
    fontFamily: 'Open Sans',
    lineHeight: 1.5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Open Sans',
    lineHeight: 1.7,
  },
  paying: {
    marginTop: 20,
  },
  notes: {
    backgroundColor: '#cbe2f7',
    marginTop: 20,
    padding: 10,
    border: '1px solid #4096ff',
    borderRadius: 6,
  },
  table: {
    marginTop: 10,
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableCol: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: 'auto',
    marginVertical: 5,
    fontSize: 10,
    fontWeight: 400,
    fontFamily: 'Open Sans',
  },
  tableHeader: {
    margin: 'auto',
    marginVertical: 5,
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Open Sans',
  },
});

Font.register({
  family: 'Open Sans',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/opensans/v34/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0C4nY1M2xLER.ttf',
    },
    {
      fontWeight: 'bold',
      src: 'https://fonts.gstatic.com/s/opensans/v34/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsgH1y4nY1M2xLER.ttf',
    },
  ],
});

// Create Document Component
const InformPDF = () => {
  const params = new URL(document.location).searchParams;
  const nickname = params.get('nickname');
  const month = params.get('month');
  const [data, setData] = useState([]);
  const [dataPartner, setDataPartner] = useState([]);
  const [total, setTotal] = useState(0);

  const handleGetData = useCallback(async () => {
    try {
      const splitMonth = month?.split('-');
      splitMonth.pop();
      const result = await InformCdrAPI.getInvoiceDetail(
        nickname,
        splitMonth?.join('')
      );
      const sum = result?.data.reduce(
        (accumulator, currentValue) => accumulator + currentValue.revenue,
        0
      );
      setTotal(sum);
      setData(result?.data || []);
      setDataPartner(result?.data_partner || []);
    } catch (error) {
      //Handle error
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (nickname && month) {
      handleGetData();
    }
  }, [handleGetData, nickname, month]);

  return (
    <PDFViewer style={{ width: '100%', height: '99.4vh' }}>
      <Document>
        <Page size='A3' style={styles.body}>
          <View>
            <Image style={styles.image} src={logo} />
          </View>

          <Text style={styles.text}>No: {data?.[0]?.inform_id}</Text>

          <View style={styles.header}>
            <Text style={styles.title}>LEEON TECHNOLOGY</Text>
            <Text style={styles.text}>
              Address: Tầng 6, tòa nhà NewSkyline, Văn Quán, Hà Đông
            </Text>
            <Text style={styles.text}>Hotline: 1900996655</Text>
            <Text style={styles.text}>Email: contact@leeon.vn</Text>
          </View>

          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: '5%' }]}>
                <Text style={styles.tableHeader}>#</Text>
              </View>
              <View style={[styles.tableCol, { width: '50%' }]}>
                <Text style={styles.tableHeader}>Hướng cuộc gọi</Text>
              </View>
              <View style={[styles.tableCol, { width: '15%' }]}>
                <Text style={styles.tableHeader}>Tổng phút gọi</Text>
              </View>
              <View style={[styles.tableCol, { width: '15%' }]}>
                <Text style={styles.tableHeader}>Đơn giá</Text>
              </View>
              <View style={[styles.tableCol, { width: '15%' }]}>
                <Text style={styles.tableHeader}>Thành tiền</Text>
              </View>
            </View>
            {data.map((item, index) => (
              <View style={styles.tableRow} key={item.id}>
                <View style={[styles.tableCol, { width: '5%' }]}>
                  <Text style={styles.tableCell}>{index}</Text>
                </View>
                <View style={[styles.tableCol, { width: '50%' }]}>
                  <Text style={styles.tableCell}>{item.callType}</Text>
                </View>
                <View style={[styles.tableCol, { width: '15%' }]}>
                  <Text style={styles.tableCell}>{item.total_minute}</Text>
                </View>
                <View style={[styles.tableCol, { width: '15%' }]}>
                  <Text style={styles.tableCell}>{item.price}</Text>
                </View>
                <View style={[styles.tableCol, { width: '15%' }]}>
                  <Text style={styles.tableCell}>{item.revenue}</Text>
                </View>
              </View>
            ))}
          </View>

          <View
            style={{
              marginTop: 10,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: 600,
                fontFamily: 'Open Sans',
                marginRight: 150,
              }}
            >
              Tổng
            </Text>

            <Text
              style={{
                fontSize: 12,
                fontWeight: 600,
                fontFamily: 'Open Sans',
              }}
            >
              {total}
            </Text>
          </View>

          <View style={styles.paying}>
            <Text style={[styles.text, { fontSize: 14, fontWeight: 'bold' }]}>
              Thông tin thanh toán:
            </Text>
            <Text style={styles.text}>Chủ tài khoản: LEEON TECHNOLOGY</Text>
            <Text style={styles.text}>Số tài khoản: 1234</Text>
          </View>

          <View style={styles.notes}>
            <Text
              style={{
                color: '#4096ff',
                fontSize: 11,
                fontFamily: 'Open Sans',
              }}
            >
              NOTES: Sau khi nhận hóa đơn này sau 2 ngày không có phản hồi thì
              mặc định 2 bên ghi nhận việc đối soát và tiến hành thanh toán hóa
              đơn Hạn thanh toán trong vòng 7 ngày
            </Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default InformPDF;
