import React, { useContext, useEffect, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ExpandLess as ExpandLessIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  OutlinedInput,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';
import { Plus as PlusIcon, Trash as TrashIcon } from '@phosphor-icons/react';
import type { EditorEvents } from '@tiptap/react';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { z as zod } from 'zod';

import type { NavItemConfig } from '@/types/nav';
import type { NavColor } from '@/types/settings';
import { DataContext } from '@/contexts/data';
import { useSettings } from '@/hooks/use-settings';
import Chatbot from '@/components/chatbot/button';
import { TextEditor } from '@/components/core/text-editor/text-editor';

import { navColorStyles } from './styles';

const personalDetailsSchema = {
  wantedJobTitle: zod.string().max(255).optional(),
  firstName: zod.string().max(255).optional(),
  lastName: zod.string().max(255).optional(),
  email: zod.string().email().max(255).optional(),
  phone: zod.string().max(255).optional(),
  country: zod.string().max(255).optional(),
  city: zod.string().max(255).optional(),
  professionalSummary: zod.string().max(255).optional(),
};

const employmentHistorySchema = {
  employmentHistory: zod.array(
    zod.object({
      id: zod.string().max(255),
      jobTitle: zod.string().min(1, { message: 'Please fill in your job title' }).max(255),
      employer: zod.string().max(255).optional(),
      startDate: zod.string().max(255).optional(),
      endDate: zod.string().max(255).optional(),
      description: zod.string().max(5000).optional(),
    })
  ),
};

const educationHistorySchema = {
  educationHistory: zod.array(
    zod.object({
      id: zod.string().max(255),
      school: zod.string().min(1, { message: 'Please fill in your school' }).max(255),
      degree: zod.string().max(255).optional(),
      startDate: zod.string().max(255).optional(),
      endDate: zod.string().max(255).optional(),
      description: zod.string().max(5000).optional(),
    })
  ),
};

const skillSchema = {
  skills: zod.array(
    zod.object({
      id: zod.string().max(255),
      skill: zod.string().min(1, { message: 'Skill is required' }).max(255),
      level: zod.number().min(1).max(5),
    })
  ),
};

const schema = zod.object({
  template: zod.enum(['basic', 'premium', 'luxury'], { required_error: 'Template selection is required' }),
  ...personalDetailsSchema,
  ...employmentHistorySchema,
  ...educationHistorySchema,
  ...skillSchema,
  handle: zod.string().max(255).optional(),
  category: zod.string().max(255).optional(),
  type: zod.string().max(255).optional(),
  description: zod.string().max(5000).optional(),
  tags: zod.string().max(255).optional(),
});

type Values = zod.infer<typeof schema>;

const defaultValues = {
  template: 'basic',
  wantedJobTitle: '',
  handle: '+65 9874 1782',
  category: '',
  type: 'physical',
  description: '',
  tags: '',
  employmentHistory: [
    {
      id: '1',
      jobTitle: 'Software Engineer',
      employer: 'Google',
      startDate: '2020-01-01',
      endDate: '2021-01-01',
      description: 'Developed and maintained software applications',
    },
    {
      id: '2',
      jobTitle: 'Software Engineer',
      employer: 'Facebook',
      startDate: '2019-01-01',
      endDate: '2020-01-01',
      description: 'Developed and maintained software applications',
    },
  ],
  educationHistory: [
    {
      // a secondary school student in Singapore
      id: '1',
      school: 'Raffles Institution',
      degree: 'GCE O-Level',
      startDate: '2017-01-01',
      endDate: '2020-01-01',
      description: 'Studied for the GCE O-Level examinations',
    },
  ],
};

export interface StepIconProps {
  number: number;
}

function StepIcon({ number }: StepIconProps): React.JSX.Element {
  return (
    <Box
      sx={{
        alignItems: 'center',
        border: '1px solid var(--mui-palette-divider)',
        borderRadius: '50%',
        display: 'flex',
        height: '40px',
        justifyContent: 'center',
        width: '40px',
      }}
    >
      <Typography variant="h6">{number}</Typography>
    </Box>
  );
}

export interface SideNavProps {
  color?: NavColor;
  items?: NavItemConfig[];
}

const SkillLevelIndicator = ({ level, onChange }: SkillLevelIndicatorProps) => {
  const levelColors = ['#FE7D8B', '#F68559', '#EC930C', '#48BA75', '#9BA1FB'];
  const softColorOpacity = 0.3;

  return (
    <Box sx={{ display: 'flex', alignItems: 'end', gap: '2px', flex: '1' }}>
      {levelColors.map((color, idx) => {
        const isActive = idx === level - 1;
        const boxColor = isActive
          ? color
          : `${color}${Math.round(softColorOpacity * 255)
              .toString(16)
              .padStart(2, '0')}`;

        return (
          <React.Fragment key={idx}>
            {idx > 0 && (
              <Box
                sx={{
                  bgcolor: boxColor,
                  width: '1px',
                  height: '100%',
                }}
              />
            )}
            <Box
              sx={{
                bgcolor: boxColor,
                flex: '1',
                height: '37px',
                '&:hover': {
                  cursor: 'pointer',
                  opacity: isActive ? 1 : 0.6,
                },
                borderRadius: '5px',
              }}
              onClick={() => onChange(idx + 1)}
            />
          </React.Fragment>
        );
      })}
    </Box>
  );
};

type SkillLevelIndicatorProps = {
  level: number;
  onChange: (newLevel: number) => void;
};

const SkillCard = ({ control, setValue, setIsLevelUpdate, item, index, removeSkill }) => {
  const skill = useWatch({ control, name: `skills.${index}.skill` });
  const level = useWatch({ control, name: `skills.${index}.level` });

  const levelTitles = ['Beginner', 'Amateur', 'Intermediate', 'Advanced', 'Expert'];
  const levelColors = ['#FE7D8B', '#F68559', '#EC930C', '#48BA75', '#9BA1FB'];

  return (
    <Card key={item.id} variant="outlined" sx={{ mb: 2, borderRadius: '16px' }}>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {skill || 'Skill'} -
              <span style={{ color: levelColors[level - 1] || levelColors[0] }}>
                {levelTitles[level - 1] || 'Beginner'}
              </span>
            </Typography>
            <IconButton
              aria-label="delete"
              onClick={() => removeSkill(index)}
              sx={{ color: 'gray', '&:hover': { color: 'black' } }}
            >
              <TrashIcon />
            </IconButton>
          </Stack>
          <Grid container spacing={2} alignItems="end">
            <Grid item xs={6}>
              <Controller
                control={control}
                name={`skills.${index}.skill`}
                render={({ field }) => (
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Skill</InputLabel>
                    <OutlinedInput {...field} />
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={6} sx={{ display: 'flex', alignItems: 'end' }}>
              <SkillLevelIndicator
                level={level || 1}
                onChange={(newLevel) => {
                  setValue(`skills.${index}.level`, newLevel);
                  setIsLevelUpdate(true);
                }}
              />
            </Grid>
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  );
};

export function SideNav({ color = 'blend_in' }: SideNavProps): React.JSX.Element {
  const {
    settings: { colorScheme = 'light' },
  } = useSettings();

  const styles = navColorStyles[colorScheme][color];

  const [isLevelUpdate, setIsLevelUpdate] = useState(false);

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    watch,
    formState: { errors },
    reset,
    register,
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const [expanded, setExpanded] = useState({});

  const {
    fields: employmentFields,
    append: appendEmployment,
    remove: removeEmployment,
  } = useFieldArray({
    control,
    register,
    name: 'employmentHistory',
  });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    register,
    name: 'educationHistory',
  });

  const {
    fields: skillsFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    control,
    register,
    name: 'skills',
  });

  const addEmploymentHistoryItem = () => {
    const newId = Date.now();
    appendEmployment({
      id: newId.toString(),
      jobTitle: '',
      employer: '',
      startDate: '',
      endDate: '',
      description: '',
    });
    setExpanded((prev) => ({ ...prev, [newId]: true }));
  };

  const removeEmploymentHistory = (index) => {
    const idToRemove = employmentFields[index].id;
    removeEmployment(index);
    setExpanded((prev) => {
      const newState = { ...prev };
      delete newState[idToRemove];
      return newState;
    });
  };

  const addEducationHistoryItem = () => {
    const newId = Date.now().toString();
    appendEducation({
      id: newId,
      school: '',
      degree: '',
      startDate: '',
      endDate: '',
      description: '',
    });
    setExpanded((prev) => ({ ...prev, [newId]: true }));
  };

  const removeEducationHistory = (index) => {
    const idToRemove = educationFields[index].id;
    removeEducation(index);
    setExpanded((prev) => {
      const newState = { ...prev };
      delete newState[idToRemove];
      return newState;
    });
  };

  const allFields = watch();
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const INACTIVITY_TIME_LIMIT = 1000;

  const { fetchData, initData, fetchInitData } = useContext(DataContext);

  const onSubmit = React.useCallback(
    async (data: Values) => {
      try {
        console.log('Submitting', data);
        setIsSubmitted(true);
        fetchData(data);
      } catch (err) {
        console.error(err);
      }
    },
    [fetchData]
  );

  const resetTimer = () => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    if (!isSubmitted) {
      inactivityTimer.current = setTimeout(() => handleSubmit(onSubmit)(), INACTIVITY_TIME_LIMIT);
    }
  };

  useEffect(() => {
    if (initData) {
      const processedData = {
        wantedJobTitle: initData.wantedJobTitle || '',
        firstName: initData.firstName || '',
        lastName: initData.lastName || '',
        email: initData.email || 'test@gmail.com',
        phone: initData.phone || '',
        country: initData.country || '',
        city: initData.city || '',
        professionalSummary: initData.professionalSummary || '',
        employmentHistory: initData.employmentHistory || [
          {
            id: '1',
            jobTitle: 'Software Engineer',
            employer: 'Google',
            startDate: '2020-01-01',
            endDate: '2021-01-01',
            description: 'Developed and maintained software applications',
          },
          {
            id: '2',
            jobTitle: 'Software Engineer',
            employer: 'Facebook',
            startDate: '2019-01-01',
            endDate: '2020-01-01',
            description: 'Developed and maintained software applications',
          },
        ],
        educationHistory: initData.educationHistory || [
          {
            id: '1',
            school: 'Teck Whye Secondary',
            degree: 'GCE O-Level',
            startDate: '2017-01-01',
            endDate: '2020-01-01',
            description: 'Studied for the GCE O-Level examinations',
          },
        ],
        skills: initData.skills || [],
        handle: initData.handle || '',
        category: initData.category || '',
        type: initData.type || 'physical',
        description: initData.description || '',
        tags: initData.tags || '',
      };

      reset(processedData);
    }
  }, [initData, reset]);

  useEffect(() => {
    const activityHandler = () => {
      if (isSubmitted) {
        setIsSubmitted(false);
        resetTimer();
      }
    };

    document.addEventListener('keypress', activityHandler);
    document.addEventListener('mousedown', activityHandler);
    resetTimer();

    return () => {
      clearTimeout(inactivityTimer.current);
      document.removeEventListener('keypress', activityHandler);
      document.removeEventListener('mousedown', activityHandler);
    };
  }, [allFields, isSubmitted]);

  // Add effect to watch for changes in allFields and reset timer
  useEffect(() => {
    resetTimer();
  }, [allFields]);

  return (
    <Box
      sx={{
        ...styles,
        bgcolor: 'var(--SideNav-background)',
        borderRight: 'var(--SideNav-border)',
        color: 'var(--SideNav-color)',
        display: { xs: 'none', lg: 'flex' },
        flexDirection: 'column',
        height: '100%',
        left: 0,
        position: 'fixed',
        top: 0,
        width: 'var(--SideNav-width)',
        zIndex: 'var(--SideNav-zIndex)',
      }}
    >
      <Box
        component="nav"
        sx={{
          flex: '1 1 auto',
          overflowY: 'auto',
          p: 6,
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={6}>
            <Stack spacing={3}>
              <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                <StepIcon number={1} />
                <Typography variant="h6">Personal Details</Typography>
              </Stack>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Select Template</FormLabel>
                    <Controller
                      control={control}
                      name="template"
                      render={({ field }) => (
                        <RadioGroup row {...field}>
                          <FormControlLabel value="basic" control={<Radio />} label="Basic" />
                          <FormControlLabel value="premium" control={<Radio />} label="Premium" />
                          <FormControlLabel value="luxury" control={<Radio />} label="Luxury" />
                        </RadioGroup>
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item sm={12} xs={12}>
                  <Controller
                    control={control}
                    name="wantedJobTitle"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.wantedJobTitle)} fullWidth>
                        <InputLabel>Wanted Job title</InputLabel>
                        <OutlinedInput {...field} />
                        {errors.wantedJobTitle && <FormHelperText>{errors.wantedJobTitle.message}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <Controller
                    control={control}
                    name="firstName"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.firstName)} fullWidth>
                        <InputLabel>First Name</InputLabel>
                        <OutlinedInput {...field} />
                        {errors.firstName && <FormHelperText>{errors.firstName.message}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <Controller
                    control={control}
                    name="lastName"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.lastName)} fullWidth>
                        <InputLabel>Last Name</InputLabel>
                        <OutlinedInput {...field} />
                        {errors.lastName && <FormHelperText>{errors.lastName.message}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.email)} fullWidth>
                        <InputLabel>Email</InputLabel>
                        <OutlinedInput {...field} />
                        {errors.email && <FormHelperText>{errors.email.message}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <Controller
                    control={control}
                    name="phone"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.phone)} fullWidth>
                        <InputLabel>Phone</InputLabel>
                        <OutlinedInput {...field} />
                        {errors.phone && <FormHelperText>{errors.phone.message}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <Controller
                    control={control}
                    name="country"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.country)} fullWidth>
                        <InputLabel>Country</InputLabel>
                        <OutlinedInput {...field} />
                        {errors.country && <FormHelperText>{errors.country.message}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <Controller
                    control={control}
                    name="city"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.city)} fullWidth>
                        <InputLabel>City</InputLabel>
                        <OutlinedInput {...field} />
                        {errors.city && <FormHelperText>{errors.city.message}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </Grid>
              </Grid>
            </Stack>
            <Stack spacing={3}>
              <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                <StepIcon number={2} />
                <Typography variant="h6">Professional Summary</Typography>
              </Stack>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    Write 2-4 short & energetic sentences to interest the reader! Mention your role, experience & most
                    importantly - your biggest achievements, best qualities and skills.
                  </Typography>
                  <Controller
                    control={control}
                    name="professionalSummary"
                    render={({ field: { onChange, value } }) => (
                      <FormControl error={Boolean(errors.professionalSummary)} fullWidth>
                        <Box sx={{ mt: '8px', '& .tiptap-container': { height: '300px' } }}>
                          <TextEditor
                            content={value || ''}
                            onUpdate={({ editor }: EditorEvents['update']) => {
                              onChange(editor.getHTML());
                            }}
                            placeholder="E.g. A passionate software engineer with 5 years of experience in building web applications..."
                          />
                        </Box>
                      </FormControl>
                    )}
                  />
                  <Typography variant="body2">
                    Recruiter tip: write 50-200 characters to increase interview chances
                  </Typography>
                </Grid>
              </Grid>
            </Stack>
            <Stack spacing={3}>
              <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                <StepIcon number={3} />
                <Typography variant="h6">Employment History</Typography>
              </Stack>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ mb: 3, position: 'relative' }}>
                    Show your relevant experience (last 10 years). Use bullet points to note your achievements, if
                    possible - use numbers/facts (Achieved X, measured by Y, by doing Z)
                  </Typography>
                  {employmentFields.map((item, index) => {
                    const isExpanded = expanded[index];

                    return (
                      <Card key={item.id} variant="outlined" sx={{ mb: 2, position: 'relative' }}>
                        <Stack spacing={0} sx={{ p: 2 }}>
                          <Stack alignItems="center" direction="row" justifyContent="space-between">
                            <Typography sx={{ fontWeight: 'bold', color: 'black' }} variant="body2">
                              {getValues(`employmentHistory.${index}.jobTitle`) &&
                              getValues(`employmentHistory.${index}.employer`) ? (
                                `${getValues(`employmentHistory.${index}.jobTitle`)} at ${getValues(`employmentHistory.${index}.employer`)}`
                              ) : (
                                <Typography color="gray">(Not specified)</Typography>
                              )}
                            </Typography>

                            <Stack direction="row" justifyContent="end" alignItems="center">
                              <IconButton
                                onClick={() => setExpanded({ ...expanded, [index]: !isExpanded })}
                                sx={{ alignSelf: 'flex-start' }}
                              >
                                {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                              </IconButton>
                              <IconButton
                                aria-label="delete"
                                onClick={() => removeEmploymentHistory(index)}
                                sx={{ color: 'gray', '&:hover': { color: 'black' } }}
                              >
                                <TrashIcon />
                              </IconButton>
                            </Stack>
                          </Stack>

                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem', mt: -1, mb: 2 }}>
                            {getValues(`employmentHistory.${index}.startDate`) &&
                            getValues(`employmentHistory.${index}.endDate`)
                              ? `${new Date(getValues(`employmentHistory.${index}.startDate`)).toLocaleDateString('default', { month: 'long', year: 'numeric' })} - ${new Date(getValues(`employmentHistory.${index}.endDate`)).toLocaleDateString('default', { month: 'long', year: 'numeric' })}`
                              : ''}
                          </Typography>

                          {isExpanded && (
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <Controller
                                  control={control}
                                  name={`employmentHistory.${index}.jobTitle`}
                                  render={({ field }) => (
                                    <FormControl fullWidth>
                                      <InputLabel>Job Title</InputLabel>
                                      <OutlinedInput {...field} />
                                    </FormControl>
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Controller
                                  control={control}
                                  name={`employmentHistory.${index}.employer`}
                                  render={({ field }) => (
                                    <FormControl fullWidth>
                                      <InputLabel>Employer</InputLabel>
                                      <OutlinedInput {...field} />
                                    </FormControl>
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Controller
                                  control={control}
                                  name={`employmentHistory.${index}.startDate`}
                                  render={({ field }) => (
                                    <FormControl fullWidth>
                                      <InputLabel>Start Date</InputLabel>
                                      <OutlinedInput {...field} type="date" />
                                    </FormControl>
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Controller
                                  control={control}
                                  name={`employmentHistory.${index}.endDate`}
                                  render={({ field }) => (
                                    <FormControl fullWidth>
                                      <InputLabel>End Date</InputLabel>
                                      <OutlinedInput {...field} type="date" />
                                    </FormControl>
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <Controller
                                  control={control}
                                  name={`employmentHistory.${index}.description`}
                                  render={({ field: { onChange, value } }) => (
                                    <FormControl
                                      error={Boolean(
                                        errors.employmentHistory && errors.employmentHistory[index]?.description
                                      )}
                                      fullWidth
                                    >
                                      <Box sx={{ mt: '5px', '& .tiptap-container': { height: '300px' } }}>
                                        <TextEditor
                                          content={value ?? ''}
                                          onUpdate={({ editor }: EditorEvents['update']) => {
                                            onChange(editor.getHTML());
                                          }}
                                          placeholder="E.g. planned a series of lessons for elderly workshops"
                                        />
                                      </Box>
                                      {errors.employmentHistory && errors.employmentHistory[index]?.description && (
                                        <FormHelperText error>
                                          {errors.employmentHistory[index]?.description?.message}
                                        </FormHelperText>
                                      )}
                                    </FormControl>
                                  )}
                                />
                              </Grid>
                            </Grid>
                          )}
                        </Stack>
                      </Card>
                    );
                  })}
                  <Button startIcon={<PlusIcon />} onClick={addEmploymentHistoryItem}>
                    Add one more employment
                  </Button>
                </Grid>
              </Grid>
            </Stack>
            <Stack spacing={3}>
              <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                <StepIcon number={4} />
                <Typography variant="h6">Education</Typography>
              </Stack>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ mb: 3, position: 'relative' }}>
                    A varied education on your resume sums up the value that your learnings and background will bring to
                    the job/role.
                  </Typography>
                  {educationFields.map((item, index) => {
                    const isExpanded = expanded[index];

                    return (
                      <Card key={item.id} variant="outlined" sx={{ mb: 2, position: 'relative' }}>
                        <Stack spacing={0} sx={{ p: 2, mb: 3 }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'black' }}>
                              {getValues(`educationHistory.${index}.school`) &&
                              getValues(`educationHistory.${index}.degree`) ? (
                                `${getValues(`educationHistory.${index}.degree`)} at ${getValues(`educationHistory.${index}.school`)}`
                              ) : (
                                <Typography color="gray">(Not specified)</Typography>
                              )}
                            </Typography>

                            <Stack direction="row" justifyContent="end" alignItems="center">
                              <IconButton
                                onClick={() => setExpanded({ ...expanded, [index]: !isExpanded })}
                                sx={{ alignSelf: 'flex-start' }}
                              >
                                {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                              </IconButton>
                              <IconButton
                                aria-label="delete"
                                onClick={() => removeEducationHistory(index)}
                                sx={{ color: 'gray', '&:hover': { color: 'black' } }}
                              >
                                <TrashIcon />
                              </IconButton>
                            </Stack>
                          </Stack>

                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem', mt: -1, mb: 2 }}>
                            {getValues(`educationHistory.${index}.startDate`) &&
                            getValues(`educationHistory.${index}.endDate`)
                              ? `${new Date(getValues(`educationHistory.${index}.startDate`)).toLocaleDateString('default', { month: 'long', year: 'numeric' })} - ${new Date(getValues(`employmentHistory.${index}.endDate`)).toLocaleDateString('default', { month: 'long', year: 'numeric' })}`
                              : ''}
                          </Typography>

                          {isExpanded && (
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <Controller
                                  control={control}
                                  name={`educationHistory.${index}.school`}
                                  render={({ field }) => (
                                    <FormControl fullWidth>
                                      <InputLabel>School</InputLabel>
                                      <OutlinedInput {...field} />
                                    </FormControl>
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Controller
                                  control={control}
                                  name={`educationHistory.${index}.degree`}
                                  render={({ field }) => (
                                    <FormControl fullWidth>
                                      <InputLabel>Degree</InputLabel>
                                      <OutlinedInput {...field} />
                                    </FormControl>
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Controller
                                  control={control}
                                  name={`educationHistory.${index}.startDate`}
                                  render={({ field }) => (
                                    <FormControl fullWidth>
                                      <InputLabel>Start Date</InputLabel>
                                      <OutlinedInput {...field} type="date" />
                                    </FormControl>
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Controller
                                  control={control}
                                  name={`educationHistory.${index}.endDate`}
                                  render={({ field }) => (
                                    <FormControl fullWidth>
                                      <InputLabel>End Date</InputLabel>
                                      <OutlinedInput {...field} type="date" />
                                    </FormControl>
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <Controller
                                  control={control}
                                  name={`educationHistory.${index}.description`}
                                  render={({ field: { onChange, value } }) => (
                                    <FormControl
                                      error={Boolean(
                                        errors.educationHistory && errors.educationHistory[index]?.description
                                      )}
                                      fullWidth
                                    >
                                      <Box sx={{ mt: '5px', '& .tiptap-container': { height: '300px' } }}>
                                        <TextEditor
                                          content={value ?? ''}
                                          onUpdate={({ editor }: EditorEvents['update']) => {
                                            onChange(editor.getHTML());
                                          }}
                                          placeholder="E.g. Graduated with Merit."
                                        />
                                      </Box>
                                      {errors.educationHistory && errors.educationHistory[index]?.description && (
                                        <FormHelperText error>
                                          {errors.educationHistory[index]?.description?.message}
                                        </FormHelperText>
                                      )}
                                    </FormControl>
                                  )}
                                />
                              </Grid>
                            </Grid>
                          )}
                        </Stack>
                      </Card>
                    );
                  })}
                  <Button startIcon={<PlusIcon />} onClick={addEducationHistoryItem}>
                    Add one more education entry
                  </Button>
                </Grid>
              </Grid>
            </Stack>
            <Stack spacing={3}>
              <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                <StepIcon number={5} />
                <Typography variant="h6">Skills</Typography>
              </Stack>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  {skillsFields.map((item, index) => (
                    <SkillCard
                      control={control}
                      index={index}
                      item={item}
                      key={item.id}
                      removeSkill={removeSkill}
                      setIsLevelUpdate={setIsLevelUpdate}
                      setValue={setValue}
                    />
                  ))}
                  <Button
                    onClick={() => appendSkill({ id: Date.now().toString(), skill: '', level: 1 })}
                    startIcon={<PlusIcon />}
                  >
                    Add a Skill
                  </Button>
                </Grid>
              </Grid>
            </Stack>
          </Stack>
        </form>
      </Box>
      <Chatbot fields={allFields} setValue={setValue} />
    </Box>
  );
}
