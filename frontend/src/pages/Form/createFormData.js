import React from 'react';

import CastForEducationIcon from '@mui/icons-material/CastForEducation';
import FaceIcon from '@mui/icons-material/Face';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';

export const roles = [
  { id: 0, display: '學生', label: 'student', icon: <FaceIcon /> },
  { id: 1, display: '家長', label: 'parent', icon: <FamilyRestroomIcon /> },
  { id: 2, display: '老師', label: 'teacher', icon: <CastForEducationIcon /> },
];

export const optionsCountList = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
  { value: 6, label: '6' },
  { value: 7, label: '7' },
  { value: 8, label: '8' },
  { value: 9, label: '9' },
  { value: 10, label: '10' },
];

// Using an empty string to clear the component or `undefined` for uncontrolled components
export const formEmptyValues = {
  researchName: [],
  formName: '',
  formCustId: '',
  minScore: '', // If set to zero, the input box will be filled with zero. But I want user to select themseves
  optionsCount: '',
  formTitle: {},
  formIntro: {},
  // This will be assigned to questionState afterward
  questions: {
    student: [],
    parent: [],
    teacher: [],
  },
};

export const questionsEmptyState = {
  student: [],
  parent: [],
  teacher: [],
};

export const getDefaultQuestionState = (id) => ({ id, label: '', options: [] });

export const createFormActionType = {
  ADD_QUESTION: 'ADD_QUESTION',
  SET_QUESTION: 'SET_QUESTION',
  REMOVE_QUESTION: 'REMOVE_QUESTION',
  ADD_STUDENT_QUESTION: 'ADD_STUDENT_QUESTION_COUNT',
  ADD_PARENT_QUESTION: 'ADD_PARENT_QUESTION_COUNT',
  ADD_TEACHER_QUESTION: 'ADD_TEACHER_QUESTION_COUNT',
  SET_STUDENT_QUESTION: 'SET_STUDENT_QUESTION',
  SET_PARENT_QUESTION: 'SET_PARENT_QUESTION',
  SET_TEACHER_QUESTION: 'SET_TEACHER_QUESTION',
};
