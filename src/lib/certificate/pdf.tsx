import path from "node:path";
import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

// Brand tokens, mirrored from globals.css. react-pdf has no access to the
// Tailwind theme, so these have to be repeated here.
const BRAND = "#7e639c";
const BRAND_DARK = "#5f4a7d";
const BRAND_SOFT = "#c9bcd9";
const PINK_DARK = "#b95d98";
const INK = "#4b4453";
const INK_SOFT = "#6f6580";

// Paths are scoped to literal subfolders on purpose: a spread here would make
// Next's file tracer include the whole project in the serverless bundle.
const fontPath = (file: string) =>
  path.join(process.cwd(), "src/lib/certificate/fonts", file);
const logoPath = path.join(process.cwd(), "public", "logo.png");

// Self-hosted so the PDF never depends on the network at request time. These
// files are kept in the repo and pulled into the serverless bundle by the
// outputFileTracingIncludes entry in next.config.ts.
Font.register({
  family: "Nunito",
  fonts: [
    { src: fontPath("Nunito-Regular.ttf"), fontWeight: 400 },
    { src: fontPath("Nunito-Bold.ttf"), fontWeight: 700 },
    { src: fontPath("Nunito-ExtraBold.ttf"), fontWeight: 800 },
  ],
});

// Nunito has no hyphenation dictionary here; without this react-pdf breaks
// long words with hyphens in odd places.
Font.registerHyphenationCallback((word) => [word]);

const styles = StyleSheet.create({
  page: {
    fontFamily: "Nunito",
    color: INK,
    backgroundColor: "#ffffff",
    padding: 28,
  },
  // The double rule matches the border-double frame used on screen.
  frameOuter: {
    flexGrow: 1,
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: BRAND,
    borderRadius: 6,
    padding: 4,
  },
  frameInner: {
    flexGrow: 1,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: BRAND,
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    paddingHorizontal: 54,
  },
  logo: { width: 86, height: 73, marginBottom: 16 },
  eyebrow: {
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: 3,
    textTransform: "uppercase",
    color: BRAND,
    marginBottom: 18,
  },
  heading: {
    fontSize: 26,
    fontWeight: 800,
    color: BRAND,
    marginBottom: 14,
    textAlign: "center",
  },
  certifies: { fontSize: 12, color: INK, marginBottom: 6 },
  name: {
    fontSize: 32,
    fontWeight: 800,
    color: PINK_DARK,
    textAlign: "center",
    paddingBottom: 8,
    paddingHorizontal: 24,
    borderBottomWidth: 2,
    borderBottomStyle: "solid",
    borderBottomColor: BRAND_SOFT,
  },
  salon: { fontSize: 11, color: INK_SOFT, marginTop: 10 },
  moduleTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: BRAND_DARK,
    textAlign: "center",
    marginTop: 22,
    marginBottom: 16,
    lineHeight: 1.4,
  },
  date: { fontSize: 11, color: INK_SOFT },
  footer: { fontSize: 9, color: INK_SOFT, marginTop: 30 },
});

export type CertificateData = {
  fullName: string;
  salonName?: string;
  moduleTitle: string;
  completedDate: string;
};

export function CertificateDocument({
  fullName,
  salonName,
  moduleTitle,
  completedDate,
}: CertificateData) {
  return (
    <Document
      title={`It's Not Gossip certificate - ${fullName}`}
      author="It's Not Gossip"
      subject={moduleTitle}
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.frameOuter}>
          <View style={styles.frameInner}>
            <Image style={styles.logo} src={logoPath} />
            <Text style={styles.eyebrow}>it&apos;s not gossip</Text>
            <Text style={styles.heading}>Certificate of Completion</Text>
            <Text style={styles.certifies}>This certifies that</Text>
            <Text style={styles.name}>{fullName}</Text>
            {salonName ? (
              <Text style={styles.salon}>of {salonName}</Text>
            ) : null}
            <Text style={styles.moduleTitle}>{moduleTitle}</Text>
            <Text style={styles.date}>Completed on {completedDate}</Text>
            <Text style={styles.footer}>
              itsnotgossip.org &middot; Registered Charity No. 1214504
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
