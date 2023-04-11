import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Font,
} from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  body: {
    padding: 20,
  },
  header: {
    display: 'flex',
  },
  leftHeader: {},
  text: {
    fontSize: 14,
    fontWeight: 400,
    color: 'gray',
    fontFamily: 'Times-Roman',
    lineHeight: 1.5,
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
    fontFamily: 'Times-Roman',
    lineHeight: 1.5,
  },
});

// Create Document Component
const InformPDF = () => {
  return (
    <PDFViewer style={{ width: '100%', height: '99.4vh' }}>
      <Document>
        <Page size='A4' style={styles.body}>
          <View style={styles.header}>
            <View style={styles.leftHeader}>
              <Text style={styles.title}>LEEON TECHNOLOGY</Text>
              <Text style={styles.text}>
                Address: Tầng 6, tòa nhà NewSkyline, Văn Quán, Hà Đông
              </Text>
              <Text style={styles.text}>Hotline: 1900996655</Text>
              {/* <Text style={styles.text}>Email: contact@leeon.vn</Text> */}
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default InformPDF;
