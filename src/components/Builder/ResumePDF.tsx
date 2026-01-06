'use client';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { ResumeState } from '@/lib/features/resume/resumeSlice';

// Register fonts if needed
// Font.register({ family: 'Inter', src: '...' });

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
    }
});

export const ResumePDF = ({ data }: { readonly data: ResumeState }) => {
    const fontSizeMap = {
        small: { body: 8, title: 20, subtitle: 12, section: 10 },
        medium: { body: 9, title: 24, subtitle: 14, section: 12 },
        large: { body: 10, title: 28, subtitle: 16, section: 14 }
    };

    const currentFontSize = fontSizeMap[data.fontSize || 'medium'];

    return (
        <Document>
            <Page
                size="A4"
                style={[
                    styles.page,
                    {
                        padding: data.margins || 40,
                        lineHeight: data.lineSpacing || 1.4
                    }
                ]}
            >
                <View style={[styles.header, { borderBottomColor: data.themeColor, marginBottom: data.sectionSpacing || 20 }]}>
                    <View style={{ width: '80%' }}>
                        <Text style={[styles.fullName, { color: data.themeColor, fontSize: currentFontSize.title }]}>
                            {data.personalInfo?.fullName || 'Your Name'}
                        </Text>
                        <Text style={[styles.jobTitle, { fontSize: currentFontSize.subtitle }]}>
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

                {data.personalInfo?.summary && (
                    <View style={[styles.section, { marginBottom: data.sectionSpacing || 15 }]}>
                        <Text style={[styles.sectionTitle, { color: data.themeColor, borderBottomColor: data.themeColor + '40', fontSize: currentFontSize.section }]}>
                            Professional Summary
                        </Text>
                        <Text style={[styles.description, { fontSize: currentFontSize.body }]}>
                            {data.personalInfo.summary}
                        </Text>
                    </View>
                )}

                {data.experiences?.length > 0 && (
                    <View style={[styles.section, { marginBottom: data.sectionSpacing || 15 }]}>
                        <Text style={[styles.sectionTitle, { color: data.themeColor, borderBottomColor: data.themeColor + '40', fontSize: currentFontSize.section }]}>
                            Work Experience
                        </Text>
                        {data.experiences?.map((exp) => (
                            <View key={exp.id} style={{ marginBottom: (data.sectionSpacing || 15) * 0.6 }}>
                                <View style={styles.itemHeader}>
                                    <Text style={[styles.itemTitle, { fontSize: currentFontSize.body + 2 }]}>{exp.position}</Text>
                                    <Text style={styles.itemDate}>{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</Text>
                                </View>
                                <Text style={[styles.itemSubtitle, { color: data.themeColor, fontSize: currentFontSize.body + 1 }]}>{exp.company}</Text>
                                <Text style={[styles.description, { fontSize: currentFontSize.body }]}>{exp.description}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {data.education?.length > 0 && (
                    <View style={[styles.section, { marginBottom: data.sectionSpacing || 15 }]}>
                        <Text style={[styles.sectionTitle, { color: data.themeColor, borderBottomColor: data.themeColor + '40', fontSize: currentFontSize.section }]}>
                            Education
                        </Text>
                        {data.education?.map((edu) => (
                            <View key={edu.id} style={{ marginBottom: (data.sectionSpacing || 15) * 0.5 }}>
                                <View style={styles.itemHeader}>
                                    <Text style={[styles.itemTitle, { fontSize: currentFontSize.body + 2 }]}>{edu.school}</Text>
                                    <Text style={styles.itemDate}>{edu.startDate} — {edu.endDate}</Text>
                                </View>
                                <Text style={[styles.itemSubtitle, { fontSize: currentFontSize.body + 1 }]}>{edu.degree} in {edu.field}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {data.skills?.length > 0 && (
                    <View style={[styles.section, { marginBottom: data.sectionSpacing || 15 }]}>
                        <Text style={[styles.sectionTitle, { color: data.themeColor, borderBottomColor: data.themeColor + '40', fontSize: currentFontSize.section }]}>
                            Skills
                        </Text>
                        <View style={styles.skillsContainer}>
                            {data.skills?.map((skill) => (
                                <Text key={skill} style={[styles.skillTag, { fontSize: currentFontSize.body - 1 }]}>{skill}</Text>
                            ))}
                        </View>
                    </View>
                )}
            </Page>
        </Document>
    );
};
