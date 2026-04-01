'use client';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { ResumeState } from '@/lib/features/resume/resumeSlice';

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        color: '#333',
    },
    header: {
        marginBottom: 20,
        borderBottom: 2,
        paddingBottom: 10,
    },
    fullName: {
        fontSize: 24,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    jobTitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    contactInfo: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        fontSize: 9,
        color: '#888',
        gap: 10,
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        borderBottom: 1,
        paddingBottom: 2,
        marginBottom: 8,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    itemTitle: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    itemSubtitle: {
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    itemDate: {
        fontSize: 9,
        color: '#666',
    },
    description: {
        fontSize: 9,
        lineHeight: 1.4,
        textAlign: 'justify',
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 5,
    },
    skillTag: {
        fontSize: 8,
        backgroundColor: '#f0f0f0',
        padding: '3 6',
        borderRadius: 3,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 5,
        position: 'absolute',
        right: 0,
        top: 0,
    },
    pageNumber: {
        position: 'absolute',
        bottom: 20,
        right: 40,
        fontSize: 8,
        color: '#aaa',
    },
});

interface ResumePDFProps {
    readonly data: ResumeState;
    readonly pages?: 1 | 2;
}

export const ResumePDF = ({ data, pages = 1 }: ResumePDFProps) => {
    const fontSizeMap = {
        small: { body: 8, title: 20, subtitle: 12, section: 10 },
        medium: { body: 9, title: 24, subtitle: 14, section: 12 },
        large: { body: 10, title: 28, subtitle: 16, section: 14 }
    };

    const fs = fontSizeMap[data.fontSize || 'medium'];
    const gap = data.sectionSpacing || 15;
    const color = data.themeColor || '#2563eb';

    const HeaderBlock = () => (
        <View style={[styles.header, { borderBottomColor: color, marginBottom: gap }]}>
            <View style={{ width: '80%' }}>
                <Text style={[styles.fullName, { color, fontSize: fs.title }]}>
                    {data.personalInfo?.fullName || 'Your Name'}
                </Text>
                <Text style={[styles.jobTitle, { fontSize: fs.subtitle }]}>
                    {data.personalInfo?.jobTitle || 'Your Professional Title'}
                </Text>
                <View style={styles.contactInfo}>
                    {data.personalInfo?.email && <Text>{data.personalInfo.email}</Text>}
                    {data.personalInfo?.phone && <Text>{data.personalInfo.phone}</Text>}
                    {data.personalInfo?.address && <Text>{data.personalInfo.address}</Text>}
                    {data.personalInfo?.website && <Text>{data.personalInfo.website}</Text>}
                </View>
            </View>
            {data.personalInfo?.avatarUrl && (
                <Image src={data.personalInfo.avatarUrl} style={styles.avatar} />
            )}
        </View>
    );

    const SummaryBlock = () => data.personalInfo?.summary ? (
        <View style={[styles.section, { marginBottom: gap }]}>
            <Text style={[styles.sectionTitle, { color, borderBottomColor: color + '40', fontSize: fs.section }]}>
                Professional Summary
            </Text>
            <Text style={[styles.description, { fontSize: fs.body }]}>
                {data.personalInfo.summary}
            </Text>
        </View>
    ) : null;

    const ExperienceBlock = () => data.experiences?.length > 0 ? (
        <View style={[styles.section, { marginBottom: gap }]}>
            <Text style={[styles.sectionTitle, { color, borderBottomColor: color + '40', fontSize: fs.section }]}>
                Work Experience
            </Text>
            {data.experiences.map((exp) => (
                <View key={exp.id} style={{ marginBottom: gap * 0.6 }}>
                    <View style={styles.itemHeader}>
                        <Text style={[styles.itemTitle, { fontSize: fs.body + 2 }]}>{exp.position}</Text>
                        <Text style={styles.itemDate}>{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</Text>
                    </View>
                    <Text style={[styles.itemSubtitle, { color, fontSize: fs.body + 1 }]}>{exp.company}</Text>
                    <Text style={[styles.description, { fontSize: fs.body }]}>{exp.description}</Text>
                </View>
            ))}
        </View>
    ) : null;

    const EducationBlock = () => data.education?.length > 0 ? (
        <View style={[styles.section, { marginBottom: gap }]}>
            <Text style={[styles.sectionTitle, { color, borderBottomColor: color + '40', fontSize: fs.section }]}>
                Education
            </Text>
            {data.education.map((edu) => (
                <View key={edu.id} style={{ marginBottom: gap * 0.5 }}>
                    <View style={styles.itemHeader}>
                        <Text style={[styles.itemTitle, { fontSize: fs.body + 2 }]}>{edu.school}</Text>
                        <Text style={styles.itemDate}>{edu.startDate} — {edu.endDate}</Text>
                    </View>
                    <Text style={[styles.itemSubtitle, { fontSize: fs.body + 1 }]}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</Text>
                </View>
            ))}
        </View>
    ) : null;

    const SkillsBlock = () => data.skills?.length > 0 ? (
        <View style={[styles.section, { marginBottom: gap }]}>
            <Text style={[styles.sectionTitle, { color, borderBottomColor: color + '40', fontSize: fs.section }]}>
                Skills
            </Text>
            <View style={styles.skillsContainer}>
                {data.skills.map((skill) => (
                    <Text key={skill} style={[styles.skillTag, { fontSize: fs.body - 1 }]}>{skill}</Text>
                ))}
            </View>
        </View>
    ) : null;

    const LanguagesBlock = () => data.languages?.length > 0 ? (
        <View style={[styles.section, { marginBottom: gap }]}>
            <Text style={[styles.sectionTitle, { color, borderBottomColor: color + '40', fontSize: fs.section }]}>
                Languages
            </Text>
            <View style={styles.skillsContainer}>
                {data.languages.map((lang) => (
                    <Text key={lang} style={[styles.skillTag, { fontSize: fs.body - 1 }]}>{lang}</Text>
                ))}
            </View>
        </View>
    ) : null;

    const CertificationsBlock = () => data.certifications?.length > 0 ? (
        <View style={[styles.section, { marginBottom: gap }]}>
            <Text style={[styles.sectionTitle, { color, borderBottomColor: color + '40', fontSize: fs.section }]}>
                Certifications
            </Text>
            {data.certifications.map((cert, i) => (
                <Text key={i} style={[styles.description, { fontSize: fs.body, marginBottom: 3 }]}>• {cert}</Text>
            ))}
        </View>
    ) : null;

    const pageStyle = [
        styles.page,
        { padding: data.margins || 40, lineHeight: data.lineSpacing || 1.4 }
    ];

    if (pages === 2) {
        return (
            <Document>
                {/* Page 1 — Header, Summary, Experience */}
                <Page size="A4" style={pageStyle}>
                    <HeaderBlock />
                    <SummaryBlock />
                    <ExperienceBlock />
                    <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
                </Page>

                {/* Page 2 — Education, Skills, Languages, Certifications */}
                <Page size="A4" style={pageStyle}>
                    {/* Compact name header on page 2 for context */}
                    <View style={{ marginBottom: gap * 0.8, borderBottom: 1, borderBottomColor: color + '30', paddingBottom: 6 }}>
                        <Text style={{ fontSize: fs.body + 1, fontWeight: 'bold', color: color }}>
                            {data.personalInfo?.fullName} — continued
                        </Text>
                    </View>
                    <EducationBlock />
                    <SkillsBlock />
                    <LanguagesBlock />
                    <CertificationsBlock />
                    <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
                </Page>
            </Document>
        );
    }

    // Default: single page (overflow handled by react-pdf's automatic page break)
    return (
        <Document>
            <Page size="A4" style={pageStyle}>
                <HeaderBlock />
                <SummaryBlock />
                <ExperienceBlock />
                <EducationBlock />
                <SkillsBlock />
                <LanguagesBlock />
                <CertificationsBlock />
            </Page>
        </Document>
    );
};
